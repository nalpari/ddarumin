import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '가맹 문의',
  description: '힘이나는커피생활 프랜차이즈 가맹문의. 성공적인 카페 창업의 파트너, 체계적인 창업 지원 프로그램.',
  keywords: ['커피 프랜차이즈', '카페 창업', '가맹문의', '힘이나는커피생활 가맹'],
  openGraph: {
    title: '가맹 문의 | 힘이나는커피생활',
    description: '힘이나는커피생활과 함께 성공적인 커피 프랜차이즈 창업을 시작하세요.'
  }
}

export default function FranchiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}