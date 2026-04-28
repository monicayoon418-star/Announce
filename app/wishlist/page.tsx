'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { useStore } from '@/store/useStore'
import EventCard from '@/components/events/EventCard'
import Link from 'next/link'
import { Event } from '@/types'

export default function WishlistPage() {
  const { data: session } = useSession()
  const { guestWishlist } = useStore()

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['wishlist-events'],
    queryFn: async () => {
      const res = await fetch('/api/wishlist/events')
      if (!res.ok) return []
      return res.json()
    },
    enabled: !!session,
  })

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="px-4 pt-5 pb-3 bg-white border-b">
          <h1 className="text-lg font-bold text-gray-900">찜 목록</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-5xl mb-4">🤍</p>
          <p className="text-gray-700 font-semibold mb-1">로그인하면 찜 목록을 저장할 수 있어요</p>
          {guestWishlist.length > 0 && (
            <p className="text-gray-400 text-sm mb-5">현재 임시 저장된 찜: {guestWishlist.length}개</p>
          )}
          <Link
            href="/operator/login"
            className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-full font-semibold text-sm"
          >
            로그인하기
          </Link>
        </div>
      </div>
    )
  }

  const active = events.filter((e) => new Date(e.endDate) >= new Date())
  const ended = events.filter((e) => new Date(e.endDate) < new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-5 pb-3 bg-white border-b sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">찜 목록</h1>
      </div>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="text-center py-20 text-gray-300 text-sm">불러오는 중...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-3">🤍</p>
            <p className="text-gray-500 text-sm">아직 찜한 이벤트가 없어요</p>
            <Link href="/explore" className="mt-4 inline-block px-4 py-2 bg-pink-500 text-white rounded-full text-sm">
              이벤트 탐색하기
            </Link>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">운영 중 ({active.length})</h2>
                <div className="grid grid-cols-2 gap-3">
                  {active.map((e) => <EventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}
            {ended.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-400 mb-3">종료 ({ended.length})</h2>
                <div className="grid grid-cols-2 gap-3 opacity-60">
                  {ended.map((e) => <EventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
