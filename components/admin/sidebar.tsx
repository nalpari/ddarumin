'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  HelpCircle,
  Coffee,
  ShoppingBag,
  Store,
  PartyPopper,
  Users,
  ChevronLeft,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const menuItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: '게시물 관리',
    icon: MessageSquare,
    subItems: [
      { title: '가맹문의', href: '/admin/franchise' },
      { title: '창업설명회', href: '/admin/sessions' },
      { title: 'FAQ', href: '/admin/posts/faqs' }
    ]
  },
  {
    title: '메뉴 관리',
    icon: Coffee,
    subItems: [
      { title: '카테고리', href: '/admin/menus/categories' },
      { title: '메뉴', href: '/admin/menus/items' },
      { title: '신메뉴', href: '/admin/menus/new-menus' }
    ]
  },
  {
    title: '매장 관리',
    href: '/admin/stores',
    icon: Store
  },
  {
    title: '이벤트 관리',
    href: '/admin/events',
    icon: PartyPopper
  },
  {
    title: '시스템 관리',
    icon: Users,
    subItems: [
      { title: '관리자', href: '/admin/system/admins' }
    ]
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className={cn(
      "bg-white border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-800">관리자 메뉴</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedItems.includes(item.title)
          const hasActiveSubItem = item.subItems?.some(subItem => isActive(subItem.href))
          
          if (item.href) {
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-gray-100",
                  isActive(item.href) && "bg-sky-50 text-sky-700 hover:bg-sky-100",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  isActive(item.href) ? "text-sky-700" : "text-gray-600"
                )} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          }
          
          return (
            <div key={item.title}>
              <button
                onClick={() => !collapsed && toggleExpanded(item.title)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-gray-100",
                  hasActiveSubItem && "bg-sky-50 text-sky-700",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.title : undefined}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={cn(
                    "h-5 w-5",
                    hasActiveSubItem ? "text-sky-700" : "text-gray-600"
                  )} />
                  {!collapsed && <span>{item.title}</span>}
                </div>
                {!collapsed && item.subItems && (
                  <ChevronLeft className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "-rotate-90"
                  )} />
                )}
              </button>
              
              {!collapsed && isExpanded && item.subItems && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "block px-3 py-2 pl-9 rounded-lg transition-colors",
                        "hover:bg-gray-100",
                        isActive(subItem.href) && "bg-sky-100 text-sky-700"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}