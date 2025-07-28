'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react'

const sessionSchema = z.object({
  name: z.string().min(2, '이름을 입력해주세요'),
  phone: z.string().regex(/^[0-9-]+$/, '전화번호 형식이 올바르지 않습니다'),
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
  sessionId: z.string().min(1, '창업설명회를 선택해주세요'),
  participants: z.string().min(1, '참석 인원을 선택해주세요')
})

type SessionForm = z.infer<typeof sessionSchema>

const upcomingSessions = [
  {
    id: '1',
    date: '2024-01-20',
    time: '14:00',
    location: '서울 본사',
    address: '서울특별시 강남구 테헤란로 123',
    seats: 20,
    available: 15
  },
  {
    id: '2',
    date: '2024-01-27',
    time: '14:00',
    location: '부산 지사',
    address: '부산광역시 해운대구 센텀시티로 55',
    seats: 15,
    available: 10
  },
  {
    id: '3',
    date: '2024-02-03',
    time: '14:00',
    location: '대구 지사',
    address: '대구광역시 중구 동성로 88',
    seats: 15,
    available: 12
  }
]

export default function StartupSessionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema)
  })

  const onSubmit = async (data: SessionForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/public/startup-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to submit')

      toast({
        title: '창업설명회 신청이 완료되었습니다',
        description: '신청하신 이메일로 확인 메일을 발송해드렸습니다.',
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
            창업설명회
          </h1>
          <p className="text-xl text-center mb-8">
            힘이나는커피생활의 성공적인 창업 노하우를 공유합니다
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">창업설명회에서 만나보세요</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-sky-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">브랜드 소개</h3>
              <p className="text-gray-600">
                힘이나는커피생활의 역사와<br />
                성공 비결을 공유합니다
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-sky-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">생생한 성공사례</h3>
              <p className="text-gray-600">
                실제 가맹점주들의<br />
                생생한 경험담을 들어보세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-sky-700" />
              </div>
              <h3 className="font-semibold text-lg mb-2">맞춤 상담</h3>
              <p className="text-gray-600">
                개별 상황에 맞는<br />
                1:1 맞춤 상담을 제공합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Session Schedule & Form */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Schedule */}
            <div>
              <h2 className="text-3xl font-bold mb-8">예정된 설명회</h2>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{session.location}</h3>
                        <p className="text-gray-600 text-sm mt-1">{session.address}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sky-700 font-medium">
                          잔여 {session.available}석
                        </span>
                        <p className="text-gray-500 text-sm">/ {session.seats}석</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-3">창업설명회 프로그램</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>14:00 - 14:30 : 힘이나는커피생활 브랜드 소개</li>
                  <li>14:30 - 15:00 : 창업 조건 및 지원 프로그램</li>
                  <li>15:00 - 15:30 : 성공 가맹점 사례 발표</li>
                  <li>15:30 - 16:00 : Q&A 및 개별 상담</li>
                </ul>
              </div>
            </div>

            {/* Application Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">설명회 신청</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">참석할 설명회 *</label>
                  <select {...register('sessionId')} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="">설명회를 선택해주세요</option>
                    {upcomingSessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.date} {session.time} - {session.location} (잔여 {session.available}석)
                      </option>
                    ))}
                  </select>
                  {errors.sessionId && (
                    <p className="text-red-500 text-sm mt-1">{errors.sessionId.message}</p>
                  )}
                </div>

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

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">참석 인원 *</label>
                  <select {...register('participants')} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="">참석 인원을 선택해주세요</option>
                    <option value="1">1명</option>
                    <option value="2">2명</option>
                    <option value="3">3명</option>
                    <option value="4">4명</option>
                  </select>
                  {errors.participants && (
                    <p className="text-red-500 text-sm mt-1">{errors.participants.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '신청 중...' : '설명회 신청하기'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}