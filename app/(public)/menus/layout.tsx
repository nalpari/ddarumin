import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '메뉴 소개',
  description: '힘이나는커피생활의 다양한 커피와 음료, 디저트 메뉴를 만나보세요. 프리미엄 원두로 만든 특별한 커피.',
  openGraph: {
    title: '메뉴 소개 | 힘이나는커피생활',
    description: '힘이나는커피생활의 다양한 커피와 음료, 디저트 메뉴를 만나보세요.'
  }
}

export default function MenusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}