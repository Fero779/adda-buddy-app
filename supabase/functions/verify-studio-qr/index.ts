import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { studio_session_id, session_token, class_id } = await req.json()

    if (!studio_session_id || !session_token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await userSupabase.auth.getClaims(token)
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const userId = claimsData.claims.sub

    // Use service role for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if the user is a teacher
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (profileError || profile?.role !== 'teacher') {
      return new Response(
        JSON.stringify({ success: false, error: 'Only teachers can login to Studio App' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Fetch the studio session
    const { data: session, error: fetchError } = await supabase
      .from('studio_sessions')
      .select('*')
      .eq('id', studio_session_id)
      .single()

    if (fetchError || !session) {
      console.error('Session fetch error:', fetchError)
      return new Response(
        JSON.stringify({ success: false, error: 'Session not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Validate session token
    if (session.session_token !== session_token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid session token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase
        .from('studio_sessions')
        .update({ status: 'expired' })
        .eq('id', studio_session_id)

      return new Response(
        JSON.stringify({ success: false, error: 'QR code has expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if already used
    if (session.status !== 'pending') {
      return new Response(
        JSON.stringify({ success: false, error: 'QR code has already been used' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate class_id matches (if provided in scan)
    if (class_id && session.class_id !== class_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'QR code does not match this class' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // TODO: In production, validate that the teacher is assigned to this class
    // For MVP, we skip this validation

    // Activate the session
    const { error: updateError } = await supabase
      .from('studio_sessions')
      .update({
        status: 'active',
        teacher_id: userId,
        activated_at: new Date().toISOString(),
      })
      .eq('id', studio_session_id)

    if (updateError) {
      console.error('Session update error:', updateError)
      throw new Error('Failed to activate session')
    }

    console.log('Studio session activated:', studio_session_id, 'for teacher:', userId)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Studio App login successful',
        class_id: session.class_id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in verify-studio-qr:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
