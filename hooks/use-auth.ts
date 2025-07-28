'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AdminUser {
  id: string
  username: string
  name: string
  status: 'ACTIVE' | 'INACTIVE'
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: adminData } = await supabase
            .from('admins')
            .select('id, username, name, status')
            .eq('username', user.email)
            .eq('status', 'ACTIVE')
            .single()

          setAdmin(adminData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        
        const { data: adminData } = await supabase
          .from('admins')
          .select('id, username, name, status')
          .eq('username', session.user.email)
          .eq('status', 'ACTIVE')
          .single()

        setAdmin(adminData)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setAdmin(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return {
    user,
    admin,
    loading,
    signOut,
    isAuthenticated: !!user && !!admin,
  }
}