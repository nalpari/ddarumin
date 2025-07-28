'use client'

import Script from 'next/script'

interface KakaoMapScriptProps {
  onLoad?: () => void
  onError?: () => void
}

export function KakaoMapScript({ onLoad, onError }: KakaoMapScriptProps) {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAPS_API_KEY

  if (!apiKey) {
    console.error('Kakao Maps API key is not set')
    return null
  }

  return (
    <Script
      src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer&autoload=false`}
      strategy="afterInteractive"
      onLoad={() => {
        window.kakao.maps.load(() => {
          console.log('Kakao Maps loaded')
          onLoad?.()
        })
      }}
      onError={() => {
        console.error('Failed to load Kakao Maps')
        onError?.()
      }}
    />
  )
}