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
