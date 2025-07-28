export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-br from-sky-50 to-sky-100">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              힘이나는커피생활
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              매일 아침을 특별하게 만드는 커피 한 잔<br />
              당신의 일상에 활력을 더해드립니다
            </p>
            <div className="flex gap-4">
              <a href="/menus" className="inline-block bg-sky-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-sky-700 transition-colors">
                메뉴 보기
              </a>
              <a href="/stores" className="inline-block bg-white text-sky-600 px-8 py-3 rounded-lg font-medium border-2 border-sky-600 hover:bg-sky-50 transition-colors">
                매장 찾기
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature sections will be added here */}
    </div>
  )
}