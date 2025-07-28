import Link from 'next/link'
import { Coffee } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">힘이나는커피생활</h3>
                <p className="text-xs">#HEEMINA COFFEE</p>
              </div>
            </div>
            <p className="text-sm">
              ㈜따름인의 커피 프랜차이즈<br />
              맛있는 커피와 함께하는 일상
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/menus" className="text-sm hover:text-white transition-colors">
                  메뉴 소개
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-sm hover:text-white transition-colors">
                  매장 찾기
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm hover:text-white transition-colors">
                  이벤트
                </Link>
              </li>
              <li>
                <Link href="/franchise" className="text-sm hover:text-white transition-colors">
                  가맹 문의
                </Link>
              </li>
            </ul>
          </div>

          {/* Franchise Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">가맹문의</h4>
            <ul className="space-y-2 text-sm">
              <li>전화: 1588-1234</li>
              <li>이메일: franchise@heemina.com</li>
              <li>운영시간: 평일 09:00-18:00</li>
            </ul>
          </div>

          {/* Company Details */}
          <div>
            <h4 className="text-white font-semibold mb-4">회사정보</h4>
            <ul className="space-y-2 text-sm">
              <li>상호: ㈜따름인</li>
              <li>대표: 홍길동</li>
              <li>사업자등록번호: 123-45-67890</li>
              <li>주소: 서울특별시 강남구 테헤란로 123</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 힘이나는커피생활. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}