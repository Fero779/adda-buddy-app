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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { role, name } = await req.json()

    // Validate role
    if (!role || !['teacher', 'influencer'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be "teacher" or "influencer"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
    
    if (claimsError || !claimsData?.claims) {
      console.error('Claims error:', claimsError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = claimsData.claims.sub

    // Use service role to update profile
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Update profile with role
    const { data: profile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: role,
        name: name || null,
        onboarded: true
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to save role' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Role saved for user ${userId}: ${role}`)

    return new Response(
      JSON.stringify({
        success: true,
        profile: {
          id: profile.id,
          user_id: profile.user_id,
          phone: profile.phone,
          name: profile.name,
          role: profile.role,
          onboarded: profile.onboarded
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in save-user-role:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})