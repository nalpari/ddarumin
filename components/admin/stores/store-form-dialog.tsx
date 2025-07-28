'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Store, StoreRegion, OperatingStatus, StoreType, StoreOption } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { FileUpload } from '@/components/ui/file-upload'
import { DaumPostcode } from '@/components/daum-postcode'

const storeSchema = z.object({
  name: z.string().min(1, '매장명을 입력해주세요'),
  region: z.nativeEnum(StoreRegion),
  address: z.string().min(1, '주소를 입력해주세요'),
  additionalAddress: z.string().optional(),
  phone: z.string().regex(/^[0-9-]+$/, '전화번호 형식이 올바르지 않습니다'),
  operatingStatus: z.nativeEnum(OperatingStatus),
  storeType: z.nativeEnum(StoreType),
  options: z.array(z.nativeEnum(StoreOption)),
  images: z.array(z.string())
})

type StoreFormData = z.infer<typeof storeSchema>

interface StoreFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: Store | null
  onSuccess: () => void
}

const storeOptions: { value: StoreOption; label: string }[] = [
  { value: 'PARKING', label: '주차가능' },
  { value: 'WIFI', label: '와이파이' },
  { value: 'PET_FRIENDLY', label: '반려동물 동반' },
  { value: 'DRIVE_THROUGH', label: '드라이브스루' },
  { value: 'DELIVERY', label: '배달가능' },
  { value: 'OUTDOOR_SEATING', label: '야외좌석' }
]

export function StoreFormDialog({
  open,
  onOpenChange,
  store,
  onSuccess
}: StoreFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showPostcode, setShowPostcode] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      region: 'SEOUL',
      operatingStatus: 'PREPARING',
      storeType: 'FRANCHISE',
      options: [],
      images: []
    }
  })

  const selectedOptions = watch('options')

  useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        region: store.region,
        address: store.address,
        additionalAddress: store.additionalAddress || '',
        phone: store.phone,
        operatingStatus: store.operatingStatus,
        storeType: store.storeType,
        options: store.options,
        images: store.images
      })
      setUploadedImages(store.images)
    } else {
      reset({
        region: 'SEOUL',
        operatingStatus: 'PREPARING',
        storeType: 'FRANCHISE',
        options: [],
        images: []
      })
      setUploadedImages([])
    }
  }, [store, reset])

  const onSubmit = async (data: StoreFormData) => {
    setIsSubmitting(true)
    
    try {
      const url = store
        ? `/api/admin/stores/${store.id}`
        : '/api/admin/stores'
      
      const method = store ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          images: uploadedImages
        })
      })

      if (!response.ok) throw new Error('Failed to save store')

      toast({
        title: '성공',
        description: store ? '매장이 수정되었습니다.' : '매장이 추가되었습니다.'
      })

      onSuccess()
    } catch {
      toast({
        title: '오류',
        description: '매장 저장에 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOptionToggle = (option: StoreOption) => {
    const current = selectedOptions || []
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option]
    setValue('options', updated)
  }

  const handleImagesChange = (urls: string[]) => {
    setUploadedImages(urls)
    setValue('images', urls)
  }

  // 주소 검색 기능
  const handleAddressSearch = () => {
    setShowPostcode(true)
  }

  const handleAddressComplete = (data: {
    roadAddress?: string
    address: string
    sido?: string
  }) => {
    setValue('address', data.roadAddress || data.address)
    setShowPostcode(false)
    
    // 지역 자동 설정
    const sido = data.sido || ''
    if (sido.includes('서울')) setValue('region', 'SEOUL')
    else if (sido.includes('경기')) setValue('region', 'GYEONGGI')
    else if (sido.includes('부산')) setValue('region', 'BUSAN')
    else if (sido.includes('대구')) setValue('region', 'DAEGU')
    else if (sido.includes('인천')) setValue('region', 'INCHEON')
    else if (sido.includes('광주')) setValue('region', 'GWANGJU')
    else if (sido.includes('대전')) setValue('region', 'DAEJEON')
    else if (sido.includes('울산')) setValue('region', 'ULSAN')
    else setValue('region', 'OTHER')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {store ? '매장 수정' : '매장 추가'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">매장명 *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="힘이나는커피생활 강남점"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="region">지역 *</Label>
              <select
                id="region"
                {...register('region')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="SEOUL">서울</option>
                <option value="GYEONGGI">경기</option>
                <option value="BUSAN">부산</option>
                <option value="DAEGU">대구</option>
                <option value="INCHEON">인천</option>
                <option value="GWANGJU">광주</option>
                <option value="DAEJEON">대전</option>
                <option value="ULSAN">울산</option>
                <option value="OTHER">기타</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">주소 *</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                {...register('address')}
                placeholder="서울특별시 강남구 테헤란로 123"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddressSearch}>
                주소 검색
              </Button>
            </div>
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="additionalAddress">상세 주소</Label>
            <Input
              id="additionalAddress"
              {...register('additionalAddress')}
              placeholder="1층 101호"
            />
          </div>

          <div>
            <Label htmlFor="phone">전화번호 *</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="02-1234-5678"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operatingStatus">운영 상태 *</Label>
              <select
                id="operatingStatus"
                {...register('operatingStatus')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="OPEN">영업중</option>
                <option value="CLOSED">영업종료</option>
                <option value="PREPARING">준비중</option>
                <option value="VACATION">휴가중</option>
              </select>
            </div>

            <div>
              <Label htmlFor="storeType">매장 구분 *</Label>
              <select
                id="storeType"
                {...register('storeType')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="DIRECT">직영점</option>
                <option value="FRANCHISE">가맹점</option>
              </select>
            </div>
          </div>

          <div>
            <Label>매장 옵션</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {storeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedOptions?.includes(option.value) || false}
                    onCheckedChange={() => handleOptionToggle(option.value)}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>매장 이미지</Label>
            <FileUpload
              value={uploadedImages}
              onChange={handleImagesChange}
              maxFiles={5}
              bucket="stores"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '저장중...' : '저장'}
            </Button>
          </div>
        </form>

        {/* 주소 검색 모달 */}
        {showPostcode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-4 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">주소 검색</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPostcode(false)}
                >
                  ✕
                </Button>
              </div>
              <DaumPostcode
                onComplete={handleAddressComplete}
                onClose={() => setShowPostcode(false)}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}