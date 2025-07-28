'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Coffee, Menu, X } from 'lucide-react'

const navigationItems = [
  { name: '메뉴', href: '/menus' },
  { name: '매장찾기', href: '/stores' },
  { name: '이벤트', href: '/events' },
  { name: '가맹문의', href: '/franchise' },
  { name: '창업설명회', href: '/startup-session' },
]

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
      isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <Coffee className="h-6 w-6 text-sky-700" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">힘이나는커피생활</h1>
              <p className="text-xs text-gray-500 -mt-1">#HEEMINA COFFEE</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-sky-700 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/franchise">
              <Button className="bg-sky-600 hover:bg-sky-700">
                가맹문의
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-gray-700 hover:text-sky-700 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t mt-4">
              <Link href="/franchise" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-sky-600 hover:bg-sky-700">
                  가맹문의
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}