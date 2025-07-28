import { ReactNode } from 'react'
import AdminHeader from '@/components/admin/header'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        {/* Sidebar will be here */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}