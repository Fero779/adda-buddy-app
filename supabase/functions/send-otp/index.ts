import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone } = await req.json()

    // Validate phone number
    if (!phone || typeof phone !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Basic phone validation (should start with + and have at least 10 digits)
    const phoneRegex = /^\+[1-9]\d{9,14}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set expiry to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Clean up old OTPs for this phone
    await supabase
      .from('phone_otps')
      .delete()
      .eq('phone', phone)

    // Insert new OTP
    const { error: insertError } = await supabase
      .from('phone_otps')
      .insert({
        phone,
        otp,
        expires_at: expiresAt,
        verified: false
      })

    if (insertError) {
      console.error('Error inserting OTP:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // In production, you would send SMS here via Twilio/MSG91/etc.
    // For now, we'll log the OTP (REMOVE IN PRODUCTION)
    console.log(`OTP for ${phone}: ${otp}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // REMOVE in production - only for testing
        debug_otp: otp
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in send-otp:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})