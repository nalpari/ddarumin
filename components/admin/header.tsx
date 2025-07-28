'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Key, Coffee } from 'lucide-react'
import Link from 'next/link'

export default function AdminHeader() {
  const { admin, signOut } = useAuth()

  return (
    <header className="bg-white border-b h-16">
      <div className="flex items-center justify-between h-full px-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
            <Coffee className="h-6 w-6 text-sky-700" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">힘이나는커피생활</h1>
            <p className="text-xs text-gray-500">관리자 시스템</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {admin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">{admin.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile/password" className="cursor-pointer">
                    <Key className="mr-2 h-4 w-4" />
                    비밀번호 변경
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}