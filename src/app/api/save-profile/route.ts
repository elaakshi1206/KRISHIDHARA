import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the authenticated user from the server session (not client-side)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[save-profile API] No authenticated user:', authError)
      return NextResponse.json(
        { error: 'Not authenticated. Please login first.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('[save-profile API] Saving profile for user:', user.id)

    const profileData = {
      id: user.id,
      full_name: body.full_name ?? null,
      state: body.state ?? null,
      district: body.district ?? null,
      village: body.village ?? null,
      age_group: body.age_group ?? null,
      farm_details: body.farm_details ?? null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('[save-profile API] Upsert error:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: 500 }
      )
    }

    console.log('[save-profile API] Profile saved successfully:', data)
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error('[save-profile API] Unexpected error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
