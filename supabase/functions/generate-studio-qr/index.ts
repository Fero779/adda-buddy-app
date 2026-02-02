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
    const { class_id } = await req.json()

    if (!class_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'class_id is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate unique identifiers
    const sessionToken = crypto.randomUUID()
    const panelId = crypto.randomUUID()
    
    // QR expires in 60 seconds
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString()

    // Create pending studio session
    const { data: session, error: insertError } = await supabase
      .from('studio_sessions')
      .insert({
        session_token: sessionToken,
        panel_id: panelId,
        class_id: class_id,
        status: 'pending',
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating studio session:', insertError)
      throw new Error('Failed to create studio session')
    }

    console.log('Created studio session:', session.id)

    // QR code data
    const qrData = {
      studio_session_id: session.id,
      panel_id: panelId,
      session_token: sessionToken,
      class_id: class_id,
      expires_at: expiresAt,
    }

    return new Response(
      JSON.stringify({
        success: true,
        qr_data: qrData,
        session_id: session.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in generate-studio-qr:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
