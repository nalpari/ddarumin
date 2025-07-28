import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '창업설명회',
  description: '힘이나는커피생활 창업설명회 신청. 성공적인 커피 프랜차이즈 창업의 모든 것을 상세히 알아보세요.',
  keywords: ['창업설명회', '커피 프랜차이즈 설명회', '카페 창업 설명회'],
  openGraph: {
    title: '창업설명회 | 힘이나는커피생활',
    description: '힘이나는커피생활의 성공적인 창업 노하우를 공유합니다.'
  }
}

export default function StartupSessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}