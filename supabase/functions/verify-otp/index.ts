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

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const passwordSecret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Use service key as secret
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('phone_otps')
      .select('*')
      .eq('phone', phone)
      .eq('otp', otp)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (otpError || !otpData) {
      console.log('OTP verification failed:', otpError)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mark OTP as verified
    await supabase
      .from('phone_otps')
      .update({ verified: true })
      .eq('id', otpData.id)

    // Generate email and password for this phone
    const email = `${phone.replace(/[^0-9]/g, '')}@phone.adda247.app`
    const password = await generatePassword(phone, passwordSecret)

    // Check if user already exists with this phone
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*, user_id')
      .eq('phone', phone)
      .single()

    let userId: string
    let isNewUser = false

    if (existingProfile) {
      // Existing user
      userId = existingProfile.user_id
      isNewUser = false
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
          phone: phone,
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
          phone: phone,
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