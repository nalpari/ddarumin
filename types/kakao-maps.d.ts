declare global {
  interface Window {
    kakao: any
    daum: any
  }
}

export interface KakaoMapOptions {
  center: {
    lat: number
    lng: number
  }
  level?: number
}

export interface MarkerOptions {
  position: {
    lat: number
    lng: number
  }
  title?: string
  image?: {
    src: string
    size: {
      width: number
      height: number
    }
  }
}

export {}