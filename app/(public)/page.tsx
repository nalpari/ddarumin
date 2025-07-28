import Image from 'next/image'
import Link from 'next/link'
import { Coffee, Award, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-coffee.jpg"
            alt="힘이나는커피생활 메인 이미지"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              힘이나는커피생활
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              매일 아침을 특별하게 만드는 커피 한 잔<br />
              당신의 일상에 활력을 더해드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/menus" className="inline-block bg-sky-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors text-center">
                메뉴 보기
              </Link>
              <Link href="/stores" className="inline-block bg-white text-sky-600 px-8 py-3 rounded-lg font-medium border-2 border-white hover:bg-sky-50 transition-colors text-center">
                매장 찾기
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">왜 힘이나는커피생활인가요?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="h-8 w-8 text-sky-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">프리미엄 원두</h3>
              <p className="text-gray-600">엄선된 고품질 원두로 깊고 풍부한 커피 맛을 제공합니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-sky-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">전문 바리스타</h3>
              <p className="text-gray-600">체계적인 교육을 받은 바리스타가 최상의 커피를 만듭니다</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-sky-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">편안한 공간</h3>
              <p className="text-gray-600">아늑하고 편안한 분위기에서 여유로운 시간을 보내세요</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-sky-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">합리적인 가격</h3>
              <p className="text-gray-600">부담없는 가격으로 프리미엄 커피를 즐기실 수 있습니다</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Menu Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">인기 메뉴</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Menu items will be dynamically loaded */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src="/images/menu-americano.jpg"
                  alt="아메리카노"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">아메리카노</h3>
                <p className="text-gray-600 text-sm mb-2">깊고 진한 에스프레소의 풍미</p>
                <p className="text-sky-700 font-bold">4,500원</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src="/images/menu-latte.jpg"
                  alt="카페라떼"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">카페라떼</h3>
                <p className="text-gray-600 text-sm mb-2">부드러운 우유와 에스프레소의 조화</p>
                <p className="text-sky-700 font-bold">5,000원</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src="/images/menu-einspanner.jpg"
                  alt="아인슈페너"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">아인슈페너</h3>
                <p className="text-gray-600 text-sm mb-2">진한 커피 위에 올린 부드러운 크림</p>
                <p className="text-sky-700 font-bold">5,500원</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/menus" className="inline-block bg-sky-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors">
              전체 메뉴 보기
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-sky-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">함께 성장할 파트너를 찾습니다</h2>
          <p className="text-white/90 text-lg mb-8">힘이나는커피생활과 함께 성공적인 창업을 시작하세요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/franchise" className="inline-block bg-white text-sky-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              가맹문의
            </Link>
            <Link href="/startup-session" className="inline-block bg-sky-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-sky-900 transition-colors">
              창업설명회 신청
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}