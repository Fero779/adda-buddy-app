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
    const { session_id } = await req.json()

    if (!session_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'session_id is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch the studio session
    const { data: session, error: fetchError } = await supabase
      .from('studio_sessions')
      .select('*')
      .eq('id', session_id)
      .single()

    if (fetchError || !session) {
      return new Response(
        JSON.stringify({ success: false, error: 'Session not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Check if expired and update status
    if (session.status === 'pending' && new Date(session.expires_at) < new Date()) {
      await supabase
        .from('studio_sessions')
        .update({ status: 'expired' })
        .eq('id', session_id)
      
      return new Response(
        JSON.stringify({
          success: true,
          status: 'expired',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // If active, fetch teacher profile
    let teacherProfile = null
    if (session.status === 'active' && session.teacher_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, phone')
        .eq('user_id', session.teacher_id)
        .single()
      
      teacherProfile = profile
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: session.status,
        class_id: session.class_id,
        teacher: teacherProfile,
        activated_at: session.activated_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in check-studio-session:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
