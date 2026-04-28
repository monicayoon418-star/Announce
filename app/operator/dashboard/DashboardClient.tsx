'use client'

import { useState } from 'react'
import { Event } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { formatDate, getEventStatus, getStatusLabel } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { signOut } from 'next-auth/react'

type Filter = 'all' | 'active' | 'ended' | 'hidden'

const statusStyle = {
  active: 'text-green-600 bg-green-50',
  ended: 'text-gray-500 bg-gray-100',
  hidden: 'text-amber-600 bg-amber-50',
}

const statusDot = { active: '🟢', ended: '⚫', hidden: '🟡' }

export default function DashboardClient({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const router = useRouter()
  const { showToast } = useStore()

  const withStatus = events.map((e) => ({
    ...e,
    computed: getEventStatus(e.startDate, e.endDate),
  }))

  const filtered = filter === 'all' ? withStatus : withStatus.filter((e) => e.computed === filter)

  const handleDelete = async (id: string) => {
    if (!confirm('이벤트를 삭제하시겠습니까?')) return
    const res = await fetch(`/api/operator/events/${id}`, { method: 'DELETE' })
    if (res.ok) {
      showToast('이벤트가 삭제되었습니다')
      router.refresh()
    } else {
      showToast('삭제 중 오류가 발생했습니다', 'error')
    }
  }

  const filters: { label: string; value: Filter }[] = [
    { label: '전체', value: 'all' },
    { label: '운영 중', value: 'active' },
    { label: '종료', value: 'ended' },
    { label: '대기', value: 'hidden' },
  ]

  return (
    <div className="px-4 py-4">
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === f.value
                ? 'border-pink-400 bg-pink-50 text-pink-600'
                : 'border-gray-200 text-gray-500 bg-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">📋</p>
          <p className="text-sm">등록된 이벤트가 없어요</p>
          <Link href="/operator/events/new" className="mt-3 inline-block text-pink-500 text-sm font-medium">
            첫 이벤트 등록하기 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">
                    {CATEGORY_LABELS[event.category]} · {formatDate(event.startDate)}~{formatDate(event.endDate)}
                  </p>
                  <h3 className="font-bold text-gray-900 text-sm truncate">{event.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[event.computed]}`}>
                      {statusDot[event.computed]} {getStatusLabel(event.computed)}
                    </span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">👀 {event.viewCount}</span>
                    <span className="text-xs text-gray-400">❤️ {event.likeCount}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Link
                    href={`/operator/events/${event.id}/edit`}
                    className="px-3 py-1.5 text-xs font-medium text-pink-600 border border-pink-200 bg-pink-50 rounded-full"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 rounded-full"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => signOut({ callbackUrl: '/operator/login' })}
        className="mt-8 w-full py-3 text-sm text-gray-400 border border-gray-200 rounded-2xl"
      >
        로그아웃
      </button>
    </div>
  )
}
