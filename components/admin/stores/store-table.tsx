'use client'

import { Store, StoreRegion, OperatingStatus, StoreType } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, MapPin, Phone, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface StoreTableProps {
  stores: Store[]
  onEdit: (store: Store) => void
  onDelete: (id: string) => void
  onView?: (store: Store) => void
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

export function StoreTable({ stores, onEdit, onDelete, onView }: StoreTableProps) {
  if (stores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        등록된 매장이 없습니다.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">매장명</th>
            <th className="text-left py-3 px-4">지역</th>
            <th className="text-left py-3 px-4">주소</th>
            <th className="text-left py-3 px-4">전화번호</th>
            <th className="text-left py-3 px-4">운영상태</th>
            <th className="text-left py-3 px-4">구분</th>
            <th className="text-center py-3 px-4">액션</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{store.name}</td>
              <td className="py-3 px-4">
                <Badge variant="outline">{regionLabels[store.region]}</Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-start space-x-1">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm">{store.address}</p>
                    {store.additionalAddress && (
                      <p className="text-xs text-gray-500">{store.additionalAddress}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{store.phone}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge className={statusColors[store.operatingStatus]}>
                  {statusLabels[store.operatingStatus]}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-gray-600">
                  {typeLabels[store.storeType]}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center space-x-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(store)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(store)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(store.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}