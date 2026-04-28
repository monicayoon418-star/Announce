'use client'

import { useStore } from '@/store/useStore'
import { Event } from '@/types'
import KakaoMap from './KakaoMap'
import CategoryFilter from '@/components/ui/CategoryFilter'
import EventDetailSheet from '@/components/events/EventDetailSheet'

interface MapClientProps {
  events: Event[]
}

export default function MapClient({ events }: MapClientProps) {
  const { selectedCategory } = useStore()

  const filtered = selectedCategory
    ? events.filter((e) => e.category === selectedCategory)
    : events

  return (
    <div className="relative w-full h-full">
      <KakaoMap events={filtered} />
      <div className="absolute top-2 left-0 right-0 z-10">
        <CategoryFilter />
      </div>
      <EventDetailSheet />
    </div>
  )
}
