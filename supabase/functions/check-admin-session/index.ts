import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

    const { session_id } = await req.json()

    if (!session_id) {
      throw new Error('Missing session_id')
    }

    // Get the admin session
    const { data: session, error: fetchError } = await serviceClient
      .from('admin_sessions')
      .select('*, profiles:user_id(phone, name, role)')
      .eq('id', session_id)
      .single()

    if (fetchError || !session) {
      console.error('Session fetch error:', fetchError)
      throw new Error('Session not found')
    }

    // Check if expired and update status
    if (session.status === 'pending' && new Date(session.expires_at) < new Date()) {
      await serviceClient
        .from('admin_sessions')
        .update({ status: 'expired' })
        .eq('id', session_id)

      return new Response(
        JSON.stringify({
          success: true,
          status: 'expired',
          message: 'QR code has expired',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // If active, return user info for session establishment
    if (session.status === 'active') {
      // Get the user's session token for the PC
      const { data: { user }, error: userError } = await serviceClient.auth.admin.getUserById(session.user_id)
      
      if (userError || !user) {
        throw new Error('Failed to get user details')
      }

      // Generate a new session for the PC
      const { data: newSession, error: sessionError } = await serviceClient.auth.admin.generateLink({
        type: 'magiclink',
        email: user.email || `${user.phone}@temp.local`,
      })

      // Mark session as used to prevent reuse
      await serviceClient
        .from('admin_sessions')
        .update({ status: 'used' })
        .eq('id', session_id)

      console.log('Admin session used:', session_id)

      return new Response(
        JSON.stringify({
          success: true,
          status: 'active',
          user_id: session.user_id,
          profile: session.profiles,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: session.status,
        expires_at: session.expires_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in check-admin-session:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
