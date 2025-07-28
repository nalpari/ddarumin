'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'

const franchiseSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z.string().regex(/^[0-9-]+$/, '전화번호 형식이 올바르지 않습니다'),
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
  region: z.string().min(2, '희망지역을 입력해주세요'),
  budget: z.string().min(1, '예상 투자금을 선택해주세요'),
  experience: z.string().min(1, '창업 경험을 선택해주세요'),
  message: z.string().min(10, '문의내용을 10자 이상 입력해주세요')
})

type FranchiseForm = z.infer<typeof franchiseSchema>

export default function FranchisePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FranchiseForm>({
    resolver: zodResolver(franchiseSchema)
  })

  const onSubmit = async (data: FranchiseForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/public/franchise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to submit')

      toast({
        title: '가맹문의가 접수되었습니다',
        description: '영업일 기준 2-3일 내에 담당자가 연락드릴 예정입니다.',
      })
      reset()
    } catch {
      toast({
        title: '오류가 발생했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-sky-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">
            함께 성공하는 파트너
          </h1>
          <p className="text-xl text-center mb-8">
            힘이나는커피생활과 함께 성공적인 창업을 시작하세요
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="font-bold text-2xl text-sky-700 mb-2">500+</h3>
              <p className="text-gray-600">전국 가맹점</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="font-bold text-2xl text-sky-700 mb-2">15%</h3>
              <p className="text-gray-600">평균 수익률</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="font-bold text-2xl text-sky-700 mb-2">18개월</h3>
              <p className="text-gray-600">평균 투자회수 기간</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="font-bold text-2xl text-sky-700 mb-2">98%</h3>
              <p className="text-gray-600">가맹점 만족도</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">가맹문의</h2>
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h3 className="text-xl font-semibold mb-6">문의 안내</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-sky-700 mt-1" />
                    <div>
                      <p className="font-medium">전화문의</p>
                      <p className="text-gray-600">1588-1234</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-sky-700 mt-1" />
                    <div>
                      <p className="font-medium">이메일</p>
                      <p className="text-gray-600">franchise@heemina.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-sky-700 mt-1" />
                    <div>
                      <p className="font-medium">상담시간</p>
                      <p className="text-gray-600">평일 09:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-sky-700 mt-1" />
                    <div>
                      <p className="font-medium">본사 위치</p>
                      <p className="text-gray-600">서울특별시 강남구 테헤란로 123</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3">창업 지원 프로그램</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 체계적인 창업 교육 프로그램</li>
                  <li>• 상권분석 및 매장 설계 지원</li>
                  <li>• 마케팅 및 홍보 지원</li>
                  <li>• 경영 컨설팅 제공</li>
                  <li>• 체계적인 메뉴 및 레시피 개발</li>
                </ul>
              </div>
            </div>

            {/* Inquiry Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">온라인 문의</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">이름 *</label>
                    <Input {...register('name')} placeholder="홍길동" />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">연락처 *</label>
                    <Input {...register('phone')} placeholder="010-1234-5678" />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">이메일 *</label>
                  <Input {...register('email')} type="email" placeholder="example@email.com" />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">희망지역 *</label>
                  <Input {...register('region')} placeholder="서울시 강남구" />
                  {errors.region && (
                    <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">예상 투자금 *</label>
                    <select {...register('budget')} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="">선택해주세요</option>
                      <option value="5000">5천만원 이하</option>
                      <option value="10000">5천만원 ~ 1억원</option>
                      <option value="15000">1억원 ~ 1억 5천만원</option>
                      <option value="20000">1억 5천만원 이상</option>
                    </select>
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">창업 경험 *</label>
                    <select {...register('experience')} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="">선택해주세요</option>
                      <option value="none">처음</option>
                      <option value="franchise">프랜차이즈 경험 있음</option>
                      <option value="business">사업 경험 있음</option>
                    </select>
                    {errors.experience && (
                      <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">문의내용 *</label>
                  <Textarea
                    {...register('message')}
                    rows={4}
                    placeholder="문의사항을 자세히 작성해주세요"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '문의 접수중...' : '가맹문의 접수'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}