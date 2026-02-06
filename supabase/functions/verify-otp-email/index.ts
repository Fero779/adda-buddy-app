import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate deterministic password from email
async function generatePassword(email: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(email + secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, otp } = await req.json()

    // Validate inputs
    if (!email || !otp) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and OTP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const normalizedOtp = String(otp).trim()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const passwordSecret = supabaseServiceKey // Use service key as secret
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('email_otps')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('otp', normalizedOtp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (otpError) {
      console.error('OTP verification error:', otpError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to verify OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!otpData) {
      // Check if OTP was already used
      const { data: usedOtp } = await supabase
        .from('email_otps')
        .select('id')
        .eq('email', normalizedEmail)
        .eq('otp', normalizedOtp)
        .eq('verified', true)
        .maybeSingle()

      if (usedOtp) {
        return new Response(
          JSON.stringify({ success: false, error: 'OTP already used. Please request a new one.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired OTP' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate auth credentials
    const password = await generatePassword(normalizedEmail, passwordSecret)

    // Check if user exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*, user_id')
      .eq('email', normalizedEmail)
      .maybeSingle()

    let userId: string
    let isNewUser = false

    if (existingProfile) {
      // Existing user - update password
      userId = existingProfile.user_id
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: password
      })
      
      if (updateError) {
        console.error('Update password error:', updateError)
      }
    } else {
      // New user - create account
      isNewUser = true

      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: password,
        email_confirm: true
      })

      if (createError) {
        console.error('Create user error:', createError)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = userData.user.id

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          email: normalizedEmail,
          phone: '', // Will be updated later if needed
          onboarded: false
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    // Sign in user
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const anonClient = createClient(supabaseUrl, anonKey)
    
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: normalizedEmail,
      password: password
    })

    if (signInError || !signInData.session) {
      console.error('Sign in error:', signInError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to sign in' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark OTP as verified
    await supabase
      .from('email_otps')
      .update({ verified: true })
      .eq('id', otpData.id)

    // Get profile data
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    console.log(`User signed in: ${userId}, isNewUser: ${isNewUser}`)

    return new Response(
      JSON.stringify({
        success: true,
        isNewUser: isNewUser,
        user: {
          id: userId,
          email: normalizedEmail,
          phone: profileData?.phone || null,
          role: profileData?.role || null,
          onboarded: profileData?.onboarded || false,
          name: profileData?.name || null
        },
        session: {
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
          expires_at: signInData.session.expires_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in verify-otp-email:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
