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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user's JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })
    
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    
    if (userError || !user) {
      console.error('User auth error:', userError)
      throw new Error('Unauthorized')
    }

    const { session_token, admin_session_id } = await req.json()

    if (!session_token || !admin_session_id) {
      throw new Error('Missing session_token or admin_session_id')
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

    // Get the admin session
    const { data: session, error: fetchError } = await serviceClient
      .from('admin_sessions')
      .select('*')
      .eq('id', admin_session_id)
      .eq('session_token', session_token)
      .single()

    if (fetchError || !session) {
      console.error('Session fetch error:', fetchError)
      throw new Error('Invalid QR code')
    }

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      await serviceClient
        .from('admin_sessions')
        .update({ status: 'expired' })
        .eq('id', admin_session_id)
      
      throw new Error('QR code has expired')
    }

    // Check if already used
    if (session.status !== 'pending') {
      throw new Error('QR code has already been used')
    }

    // Activate the session for this user
    const { error: updateError } = await serviceClient
      .from('admin_sessions')
      .update({
        status: 'active',
        user_id: user.id,
        activated_at: new Date().toISOString(),
      })
      .eq('id', admin_session_id)

    if (updateError) {
      console.error('Session update error:', updateError)
      throw new Error('Failed to activate session')
    }

    console.log('Admin session activated:', admin_session_id, 'for user:', user.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'PC login authorized successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in verify-admin-qr:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
