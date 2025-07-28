'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FAQCategory } from '@prisma/client'

type FAQItem = {
  id: string
  category: FAQCategory
  title: string
  content: string
  question?: string
  answer?: string
}

type CategoryItem = {
  id: string
  name: string
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqsData, categoriesData] = await Promise.all([
          fetch('/api/public/faqs').then(res => res.json()),
          fetch('/api/public/faq-categories').then(res => res.json())
        ])
        setFaqs(faqsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch FAQ data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">자주 묻는 질문</h1>
          <p className="text-center text-gray-600 text-lg mb-8">
            궁금하신 점을 빠르게 찾아보세요
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="질문을 검색해보세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                <p className="mt-4 text-gray-600">FAQ를 불러오는 중...</p>
              </div>
            ) : filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-sky-600 font-semibold mt-0.5">Q.</span>
                        <h3 className="font-medium text-gray-900">{faq.title}</h3>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-sky-600 font-semibold">A.</span>
                          <div className="text-gray-600 whitespace-pre-wrap">{faq.content}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-sky-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">찾으시는 답변이 없으신가요?</h2>
              <p className="text-gray-700 mb-6">
                고객센터로 문의해주시면 친절하게 답변해드리겠습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div>
                  <p className="font-semibold">전화문의</p>
                  <p className="text-sky-700 text-lg">1588-1234</p>
                </div>
                <div className="sm:border-l sm:pl-4">
                  <p className="font-semibold">이메일</p>
                  <p className="text-sky-700 text-lg">support@heemina.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}