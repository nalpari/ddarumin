'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface DaumPostcodeProps {
  onComplete: (data: any) => void
  onClose?: () => void
}

export function DaumPostcode({ onComplete, onClose }: DaumPostcodeProps) {
  useEffect(() => {
    if (!window.daum) return

    const container = document.getElementById('daum-postcode-container')
    if (!container) return

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        onComplete({
          address: data.address,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
          zonecode: data.zonecode,
          buildingName: data.buildingName,
          addressType: data.addressType
        })
      },
      onclose: onClose,
      width: '100%',
      height: '100%'
    }).embed(container)
  }, [onComplete, onClose])

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />
      <div
        id="daum-postcode-container"
        style={{ width: '100%', height: '400px' }}
      />
    </>
  )
}