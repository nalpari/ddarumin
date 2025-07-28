import { ReactNode } from 'react'
import { Metadata } from 'next'
import PublicHeader from '@/components/public/header'
import PublicFooter from '@/components/public/footer'

export const metadata: Metadata = {
  title: {
    default: '힘이나는커피생활 - #HEEMINA COFFEE',
    template: '%s | 힘이나는커피생활'
  },
  description: '매일 아침을 특별하게 만드는 커피 한 잔, 힘이나는커피생활과 함께 성공적인 창업을 시작하세요.',
  keywords: ['힘이나는커피생활', 'HEEMINA COFFEE', '커피 프랜차이즈', '창업', '가맹문의', '카페 창업'],
  authors: [{ name: '㈜따름인' }],
  creator: '㈜따름인',
  publisher: '㈜따름인',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://heemina.com',
    siteName: '힘이나는커피생활',
    title: '힘이나는커피생활 - #HEEMINA COFFEE',
    description: '매일 아침을 특별하게 만드는 커피 한 잔',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '힘이나는커피생활'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '힘이나는커피생활 - #HEEMINA COFFEE',
    description: '매일 아침을 특별하게 만드는 커피 한 잔',
    images: ['/images/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'google-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code'
  }
}

export default function PublicLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}