import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import AdminHeader from '@/components/admin/header'
import AdminSidebar from '@/components/admin/sidebar'
import { requireAdminAuth } from '@/lib/supabase/admin'

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Check admin authentication
  const admin = await requireAdminAuth()
  
  if (!admin) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}