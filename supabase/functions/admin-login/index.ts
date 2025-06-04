
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password } = await req.json()

    console.log('Admin login attempt for:', email)

    // First verify the user exists in admin_users table
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      console.error('Admin user not found or inactive:', adminError)
      throw new Error('Invalid admin credentials')
    }

    console.log('Admin user found:', adminUser.id)

    // Verify password
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    if (passwordHash !== adminUser.password_hash) {
      console.error('Password mismatch')
      throw new Error('Invalid admin credentials')
    }

    console.log('Password verified')

    // Update last login
    await supabaseAdmin
      .from('admin_users')
      .update({ 
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', adminUser.id)

    // Create session token manually (simplified approach)
    const sessionToken = btoa(JSON.stringify({
      user_id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }))

    console.log('Admin session created successfully')

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          is_active: adminUser.is_active,
          last_login_at: adminUser.last_login_at,
          created_at: adminUser.created_at
        },
        session: {
          access_token: sessionToken,
          token_type: 'bearer',
          expires_in: 86400
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Admin login error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Invalid credentials' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      },
    )
  }
})
