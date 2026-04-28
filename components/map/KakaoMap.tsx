'use client'

import { useEffect, useRef, useCallback } from 'react'
import Script from 'next/script'
import { Event, CATEGORY_COLORS, CATEGORY_EMOJI } from '@/types'
import { useStore } from '@/store/useStore'

interface KakaoMapProps {
  events: Event[]
}

export default function KakaoMap({ events }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<kakao.maps.Map | null>(null)
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([])
  const { setSelectedEvent } = useStore()

  const renderMarkers = useCallback(
    (map: kakao.maps.Map) => {
      overlaysRef.current.forEach((o) => o.setMap(null))
      overlaysRef.current = []

      events.forEach((event) => {
        const color = CATEGORY_COLORS[event.category]
        const emoji = CATEGORY_EMOJI[event.category]

        const div = document.createElement('div')
        div.style.cssText = 'cursor:pointer;'
        div.innerHTML = `
          <div style="
            width:40px;height:40px;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);background:${color};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 3px 10px rgba(0,0,0,0.2);border:2.5px solid white;
          ">
            <span style="transform:rotate(45deg);font-size:16px;line-height:1">${emoji}</span>
          </div>
        `
        div.addEventListener('click', () => setSelectedEvent(event))

        const overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(event.lat, event.lng),
          content: div,
          yAnchor: 1,
          zIndex: 3,
        })
        overlay.setMap(map)
        overlaysRef.current.push(overlay)
      })
    },
    [events, setSelectedEvent]
  )

  const initMap = useCallback(() => {
    if (!window.kakao || !mapRef.current) return
    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current!, {
        center: new window.kakao.maps.LatLng(37.5519, 126.9918),
        level: 7,
      })
      mapInstanceRef.current = map
      renderMarkers(map)
    })
  }, [renderMarkers])

  useEffect(() => {
    if (mapInstanceRef.current) renderMarkers(mapInstanceRef.current)
  }, [events, renderMarkers])

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        onLoad={initMap}
        strategy="afterInteractive"
      />
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}
