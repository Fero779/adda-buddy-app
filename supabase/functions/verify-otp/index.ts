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

    // Check if user already exists with this phone
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*, user_id')
      .eq('phone', phone)
      .single()

    let userId: string
    let isNewUser = false
    let session = null

    if (existingProfile) {
      // Existing user - sign them in
      userId = existingProfile.user_id
      
      // Generate a magic link token for the user
      const email = `${phone.replace(/[^0-9]/g, '')}@phone.adda247.app`
      
      const { data: signInData, error: signInError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: `${req.headers.get('origin') || 'https://localhost:3000'}/`
        }
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        return new Response(
          JSON.stringify({ error: 'Failed to sign in' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // For phone auth, we'll return user data and create session on client
      return new Response(
        JSON.stringify({
          success: true,
          isNewUser: false,
          user: {
            id: userId,
            phone: phone,
            role: existingProfile.role,
            onboarded: existingProfile.onboarded,
            name: existingProfile.name
          },
          // Use magic link properties
          token_hash: signInData.properties?.hashed_token,
          verification_type: 'magiclink'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // New user - create account
      isNewUser = true
      const email = `${phone.replace(/[^0-9]/g, '')}@phone.adda247.app`
      const password = crypto.randomUUID() // Random password since we use phone auth

      // Create user
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

      // Generate magic link for new user
      const { data: signInData, error: signInError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: `${req.headers.get('origin') || 'https://localhost:3000'}/`
        }
      })

      if (signInError) {
        console.error('Sign in error for new user:', signInError)
      }

      return new Response(
        JSON.stringify({
          success: true,
          isNewUser: true,
          user: {
            id: userId,
            phone: phone,
            role: null,
            onboarded: false,
            name: null
          },
          token_hash: signInData?.properties?.hashed_token,
          verification_type: 'magiclink'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error in verify-otp:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})