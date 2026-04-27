import { createClient } from './client'

export async function pushUserDetails(userId: string, userDetails: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...userDetails,
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    console.error('Error pushing user details:', error)
    throw error
  }

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
    console.error('Error fetching user details:', error)
    return null
  }

  return data
}
