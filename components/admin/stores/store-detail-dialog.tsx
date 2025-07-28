'use client'

import { Store, StoreRegion, OperatingStatus, StoreType, StoreOption } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Wifi, Car, Coffee, Package, Trees, Heart } from 'lucide-react'
import Image from 'next/image'
import { KakaoMap } from '@/components/kakao-map'

interface StoreDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: Store | null
}

const regionLabels: Record<StoreRegion, string> = {
  SEOUL: '서울',
  GYEONGGI: '경기',
  BUSAN: '부산',
  DAEGU: '대구',
  INCHEON: '인천',
  GWANGJU: '광주',
  DAEJEON: '대전',
  ULSAN: '울산',
  OTHER: '기타'
}

const statusLabels: Record<OperatingStatus, string> = {
  OPEN: '영업중',
  CLOSED: '영업종료',
  PREPARING: '준비중',
  VACATION: '휴가중'
}

const statusColors: Record<OperatingStatus, string> = {
  OPEN: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  PREPARING: 'bg-yellow-100 text-yellow-800',
  VACATION: 'bg-blue-100 text-blue-800'
}

const typeLabels: Record<StoreType, string> = {
  DIRECT: '직영점',
  FRANCHISE: '가맹점'
}

const optionIcons: Record<StoreOption, React.ReactNode> = {
  PARKING: <Car className="h-4 w-4" />,
  WIFI: <Wifi className="h-4 w-4" />,
  PET_FRIENDLY: <Heart className="h-4 w-4" />,
  DRIVE_THROUGH: <Coffee className="h-4 w-4" />,
  DELIVERY: <Package className="h-4 w-4" />,
  OUTDOOR_SEATING: <Trees className="h-4 w-4" />
}

const optionLabels: Record<StoreOption, string> = {
  PARKING: '주차가능',
  WIFI: '와이파이',
  PET_FRIENDLY: '반려동물 동반',
  DRIVE_THROUGH: '드라이브스루',
  DELIVERY: '배달가능',
  OUTDOOR_SEATING: '야외좌석'
}

export function StoreDetailDialog({
  open,
  onOpenChange,
  store
}: StoreDetailDialogProps) {
  if (!store) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{store.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">지역</p>
              <Badge variant="outline">{regionLabels[store.region]}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">운영 상태</p>
              <Badge className={statusColors[store.operatingStatus]}>
                {statusLabels[store.operatingStatus]}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">매장 구분</p>
              <p className="font-medium">{typeLabels[store.storeType]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">전화번호</p>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{store.phone}</p>
              </div>
            </div>
          </div>

          {/* 주소 */}
          <div>
            <p className="text-sm text-gray-500 mb-1">주소</p>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <div>
                <p className="font-medium">{store.address}</p>
                {store.additionalAddress && (
                  <p className="text-sm text-gray-600">{store.additionalAddress}</p>
                )}
              </div>
            </div>
          </div>

          {/* 옵션 */}
          {store.options.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">매장 옵션</p>
              <div className="flex flex-wrap gap-2">
                {store.options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    {optionIcons[option]}
                    <span className="text-sm">{optionLabels[option]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 이미지 갤러리 */}
          {store.images.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">매장 이미지</p>
              <div className="grid grid-cols-3 gap-2">
                {store.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`${store.name} - ${index + 1}`}
                    width={128}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* 지도 */}
          <div>
            <p className="text-sm text-gray-500 mb-2">위치</p>
            <div className="border rounded-lg overflow-hidden">
              <KakaoMap
                stores={[store]}
                className="h-[300px]"
                level={5}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}