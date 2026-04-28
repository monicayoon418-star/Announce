'use client'

import { useStore } from '@/store/useStore'
import { Event } from '@/types'
import KakaoMap from './KakaoMap'
import CategoryFilter from '@/components/ui/CategoryFilter'
import EventDetailSheet from '@/components/events/EventDetailSheet'

export default function MapClient({ events }: { events: Event[] }) {
  const { selectedCategory } = useStore()

  const filtered = selectedCategory
    ? events.filter((e) => e.category === selectedCategory)
    : events

  return (
    <div className="relative w-full h-full">
      <KakaoMap events={filtered} />

      {/* 카테고리 필터 - 지도 위 상단 */}
      <div className="absolute top-3 left-0 right-0 z-20 px-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm py-1">
          <CategoryFilter />
        </div>
      </div>

      {/* 이벤트 없을 때 안내 */}
      {events.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4 text-center shadow">
            <p className="text-2xl mb-1">🗺️</p>
            <p className="text-sm text-gray-500">등록된 이벤트가 없어요</p>
          </div>
        </div>
      )}

      <EventDetailSheet />
    </div>
  )
}
