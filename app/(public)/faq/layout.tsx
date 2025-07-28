import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  description: '힘이나는커피생활에 대한 궁금한 점을 FAQ에서 확인하세요. 가맹문의, 메뉴, 창업 정보 등 다양한 정보를 제공합니다.',
  openGraph: {
    title: '자주 묻는 질문 | 힘이나는커피생활',
    description: '힘이나는커피생활에 대한 궁금한 점을 FAQ에서 확인하세요.'
  }
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}