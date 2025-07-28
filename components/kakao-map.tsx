'use client'

import { useEffect, useRef, useState } from 'react'
import { KakaoMapScript } from './kakao-map-script'
import { Store } from '@prisma/client'

interface KakaoMapProps {
  stores?: Store[]
  center?: { lat: number; lng: number }
  level?: number
  className?: string
  showCurrentLocation?: boolean
  onStoreClick?: (store: Store) => void
}

export function KakaoMap({
  stores = [],
  center = { lat: 37.5665, lng: 126.9780 }, // 서울시청 기본 좌표
  level = 8,
  className = '',
  showCurrentLocation = false,
  onStoreClick
}: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current || !window.kakao) return

    const options = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: level
    }

    mapInstance.current = new window.kakao.maps.Map(mapContainer.current, options)

    // 현재 위치 표시
    if (showCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const locPosition = new window.kakao.maps.LatLng(lat, lng)

        new window.kakao.maps.Marker({
          map: mapInstance.current,
          position: locPosition,
          image: new window.kakao.maps.MarkerImage(
            '/images/current-location.png',
            new window.kakao.maps.Size(24, 24),
            { offset: new window.kakao.maps.Point(12, 12) }
          )
        })

        mapInstance.current.setCenter(locPosition)
      })
    }

    // 매장 마커 추가
    stores.forEach((store) => {
      // 주소를 좌표로 변환 (실제 구현시 Geocoding API 사용 필요)
      // 현재는 임시 좌표 사용
      const position = new window.kakao.maps.LatLng(
        center.lat + (Math.random() - 0.5) * 0.1,
        center.lng + (Math.random() - 0.5) * 0.1
      )

      const marker = new window.kakao.maps.Marker({
        map: mapInstance.current,
        position: position,
        title: store.name
      })

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onStoreClick?.(store)
      })

      // 인포윈도우
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:10px;min-width:200px;">
            <h4 style="margin:0 0 5px 0;font-weight:bold;">${store.name}</h4>
            <p style="margin:0;font-size:13px;">${store.address}</p>
            <p style="margin:5px 0 0 0;font-size:12px;color:#666;">${store.phone}</p>
          </div>
        `
      })

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.open(mapInstance.current, marker)
      })

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close()
      })

      markersRef.current.push(marker)
    })

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
    }
  }, [isMapLoaded, stores, center, level, showCurrentLocation, onStoreClick])

  return (
    <>
      <KakaoMapScript onLoad={() => setIsMapLoaded(true)} />
      <div
        ref={mapContainer}
        className={`w-full ${className}`}
        style={{ minHeight: '400px' }}
      />
    </>
  )
}