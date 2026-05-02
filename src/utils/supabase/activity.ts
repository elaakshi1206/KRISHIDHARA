import { createClient } from './client'

export async function recordLogin(userId: string, deviceInfo?: any) {
  const supabase = createClient()
  
  // Record in login_history
  const { error: historyError } = await supabase
    .from('login_history')
    .insert({
      user_id: userId,
      device_info: deviceInfo,
    })

  if (historyError) {
    console.error('Error recording login history:', historyError)
  }

  // Update last_login in profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      last_login: new Date().toISOString(),
    })
    .eq('id', userId)

  if (profileError) {
    console.error('Error updating last login in profile:', profileError)
  }
}
