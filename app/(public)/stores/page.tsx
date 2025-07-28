'use client'

import { useState, useEffect } from 'react'
import { Store, StoreRegion, OperatingStatus, StoreOption } from '@prisma/client'
import { KakaoMap } from '@/components/kakao-map'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Phone, Navigation } from 'lucide-react'
import Image from 'next/image'

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

const optionLabels: Record<StoreOption, string> = {
  PARKING: '주차가능',
  WIFI: '와이파이',
  PET_FRIENDLY: '반려동물 동반',
  DRIVE_THROUGH: '드라이브스루',
  DELIVERY: '배달가능',
  OUTDOOR_SEATING: '야외좌석'
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<StoreRegion | 'all'>('all')
  const [selectedOptions, setSelectedOptions] = useState<StoreOption[]>([])
  const [showMap, setShowMap] = useState(true)
  const [_loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    fetchStores()
    getUserLocation()
  }, [])

  useEffect(() => {
    filterStores()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores, searchTerm, selectedRegion, selectedOptions])

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores')
      if (!response.ok) throw new Error('Failed to fetch stores')
      const data = await response.json()
      setStores(data)
      setFilteredStores(data)
    } catch (error) {
      console.error('Failed to fetch stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Failed to get user location:', error)
        }
      )
    }
  }

  const filterStores = () => {
    let filtered = stores.filter(store => store.operatingStatus === 'OPEN')

    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(store => store.region === selectedRegion)
    }

    if (selectedOptions.length > 0) {
      filtered = filtered.filter(store =>
        selectedOptions.every(option => store.options.includes(option))
      )
    }

    setFilteredStores(filtered)
  }

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store)
  }

  const toggleOption = (option: StoreOption) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    )
  }

  const handleFindNearest = () => {
    if (!userLocation) {
      alert('위치 정보를 가져올 수 없습니다.')
      return
    }
    // TODO: 실제 거리 계산 로직 구현 필요
    alert('가까운 매장 찾기 기능은 추후 구현 예정입니다.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">매장 찾기</h1>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="매장명 또는 주소로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as StoreRegion | 'all')}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">전체 지역</option>
              {Object.entries(regionLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={handleFindNearest}
              disabled={!userLocation}
            >
              <Navigation className="mr-2 h-4 w-4" />
              가까운 매장 찾기
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? '목록으로 보기' : '지도로 보기'}
            </Button>
          </div>

          {/* 옵션 필터 */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(optionLabels).map(([value, label]) => (
              <Badge
                key={value}
                variant={selectedOptions.includes(value as StoreOption) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleOption(value as StoreOption)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* 결과 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 지도 또는 목록 */}
          <div className={`${showMap ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {showMap ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <KakaoMap
                  stores={filteredStores}
                  center={userLocation || { lat: 37.5665, lng: 126.9780 }}
                  className="h-[600px]"
                  showCurrentLocation={!!userLocation}
                  onStoreClick={handleStoreClick}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStoreClick(store)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{store.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{store.phone}</span>
                      </div>
                    </div>
                    {store.options.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {store.options.map((option) => (
                          <Badge key={option} variant="secondary" className="text-xs">
                            {optionLabels[option]}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 선택된 매장 상세 정보 */}
          {showMap && (
            <div className="lg:col-span-1">
              {selectedStore ? (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">{selectedStore.name}</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">주소</p>
                      <p className="font-medium">{selectedStore.address}</p>
                      {selectedStore.additionalAddress && (
                        <p className="text-sm text-gray-600">{selectedStore.additionalAddress}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">전화번호</p>
                      <p className="font-medium">{selectedStore.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">운영 상태</p>
                      <Badge variant={selectedStore.operatingStatus === 'OPEN' ? 'default' : 'secondary'}>
                        {statusLabels[selectedStore.operatingStatus]}
                      </Badge>
                    </div>

                    {selectedStore.options.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">제공 서비스</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedStore.options.map((option) => (
                            <Badge key={option} variant="outline">
                              {optionLabels[option]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStore.images.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">매장 사진</p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedStore.images.slice(0, 4).map((image, index) => (
                            <Image
                              key={index}
                              src={image}
                              alt={`${selectedStore.name} - ${index + 1}`}
                              width={96}
                              height={96}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>매장을 선택하면 상세 정보를 볼 수 있습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 결과 개수 */}
        <div className="text-center mt-6 text-gray-600">
          총 {filteredStores.length}개의 매장이 검색되었습니다.
        </div>
      </div>
    </div>
  )
}