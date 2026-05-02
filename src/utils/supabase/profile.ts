import { createClient } from './client'

export async function pushUserDetails(userId: string, userDetails: any) {
  const supabase = createClient()

  console.log('[pushUserDetails] Attempting upsert for userId:', userId)
  console.log('[pushUserDetails] Payload:', JSON.stringify(userDetails, null, 2))

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...userDetails,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id',
    })
    .select()

  if (error) {
    console.error('[pushUserDetails] Supabase upsert error:', JSON.stringify(error, null, 2))
    throw error
  }

  console.log('[pushUserDetails] Upsert successful:', data)
  return data
}

export async function fetchUserDetails(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('[fetchUserDetails] Error:', error)
    return null
  }

  return data
}
