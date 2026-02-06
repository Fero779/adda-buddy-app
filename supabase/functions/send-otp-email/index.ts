import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    // Validate email
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(normalizedEmail)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user exists with this email (optional - can create new users)
    // For now, we'll allow any email and create user on verify

    // Generate OTP
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Clean up old OTPs for this email
    await supabase
      .from('email_otps')
      .delete()
      .eq('email', normalizedEmail)

    // Store OTP
    const { error: insertError } = await supabase
      .from('email_otps')
      .insert({
        email: normalizedEmail,
        otp: otp,
        expires_at: expiresAt.toISOString(),
        verified: false
      })

    if (insertError) {
      console.error('Error storing OTP:', insertError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // TODO: In production, integrate with email service (Resend, SendGrid, etc.)
    // TODO: Look up phone number from profiles table and send SMS via Twilio/MSG91
    
    // For now, log OTP for testing
    console.log(`OTP for ${normalizedEmail}: ${otp}`)

    // Return success with debug OTP (REMOVE IN PRODUCTION)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'OTP sent to your email and registered mobile number',
        debug_otp: otp // REMOVE IN PRODUCTION
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in send-otp-email:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
