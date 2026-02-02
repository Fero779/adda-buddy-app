import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate deterministic password from phone
async function generatePassword(phone: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(phone + secret)
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
    const { phone, otp } = await req.json()

    // Validate inputs
    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ error: 'Phone and OTP are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const normalizedPhone = String(phone).replace(/\s/g, '')

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const passwordSecret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Use service key as secret
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify OTP (do NOT mark as verified until we successfully create a session)
    const { data: otpData, error: otpError } = await supabase
      .from('phone_otps')
      .select('*')
      .eq('phone', normalizedPhone)
      .eq('otp', otp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (otpError) {
      console.log('OTP verification error:', otpError)
      return new Response(
        JSON.stringify({ error: 'Failed to verify OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!otpData) {
      // Helpful message when user tries to reuse an OTP that was already accepted
      const { data: usedOtp } = await supabase
        .from('phone_otps')
        .select('id')
        .eq('phone', normalizedPhone)
        .eq('otp', otp)
        .eq('verified', true)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (usedOtp) {
        return new Response(
          JSON.stringify({ error: 'OTP already used. Please request a new OTP.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate email and password for this phone
    const email = `${normalizedPhone.replace(/[^0-9]/g, '')}@phone.adda247.app`
    const password = await generatePassword(normalizedPhone, passwordSecret)

    // Check if user already exists with this phone
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*, user_id')
      .eq('phone', normalizedPhone)
      .single()

    let userId: string
    let isNewUser = false

    if (existingProfile) {
      // Existing user - update their password to the deterministic one
      userId = existingProfile.user_id
      isNewUser = false
      
      // Update the user's password to ensure we can sign them in
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: password
      })
      
      if (updateError) {
        console.error('Update password error:', updateError)
        // Continue anyway - might work if password was already correct
      }
    } else {
      // New user - create account
      isNewUser = true

      // Create user with deterministic password
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        phone: phone,
        phone_confirm: true
      })

      if (createError) {
        console.error('Create user error:', createError)
        return new Response(
          JSON.stringify({ error: 'Failed to create account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = userData.user.id

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          phone: normalizedPhone,
          onboarded: false
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    // Sign in the user using anon client to get proper session
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const anonClient = createClient(supabaseUrl, anonKey)
    
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (signInError || !signInData.session) {
      console.error('Sign in error:', signInError)
      return new Response(
        JSON.stringify({ error: 'Failed to sign in' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark OTP as verified only after successful sign-in
    await supabase
      .from('phone_otps')
      .update({ verified: true })
      .eq('id', otpData.id)
      .eq('verified', false)

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
          phone: normalizedPhone,
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
    console.error('Error in verify-otp:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})