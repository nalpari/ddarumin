import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getAdminUser() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Check if user exists in admins table
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('username', user.email)
    .eq('status', 'ACTIVE')
    .single()

  return admin
}

export async function requireAdminAuth() {
  const admin = await getAdminUser()
  
  if (!admin) {
    redirect('/admin/login')
  }
  
  return admin
}