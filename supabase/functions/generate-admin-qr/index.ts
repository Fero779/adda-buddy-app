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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate unique identifiers
    const sessionToken = crypto.randomUUID()
    const pcId = crypto.randomUUID()
    
    // QR expires in 60 seconds
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString()

    // Create pending admin session
    const { data: session, error: insertError } = await supabase
      .from('admin_sessions')
      .insert({
        session_token: sessionToken,
        pc_id: pcId,
        status: 'pending',
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating admin session:', insertError)
      throw new Error('Failed to create admin session')
    }

    console.log('Created admin session:', session.id)

    // QR code data
    const qrData = {
      admin_session_id: session.id,
      pc_id: pcId,
      session_token: sessionToken,
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
    console.error('Error in generate-admin-qr:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
