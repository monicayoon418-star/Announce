import { prisma } from '@/lib/prisma'
import EventCard from '@/components/events/EventCard'
import ExploreFilters from './ExploreFilters'

async function getEvents(search?: string, category?: string) {
  return prisma.event.findMany({
    where: {
      status: { not: 'hidden' },
      ...(category ? { category: category as 'birthday' | 'exhibition' | 'popup' } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { artist: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}) {
  const events = await getEvents(searchParams.search, searchParams.category)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="px-4 pt-4 pb-0">
          <h1 className="text-lg font-bold text-gray-900 mb-3">이벤트 탐색</h1>
        </div>
        <ExploreFilters
          initialSearch={searchParams.search ?? ''}
          initialCategory={searchParams.category ?? ''}
        />
      </div>

      <div className="px-4 py-4">
        <p className="text-xs text-gray-400 mb-3">총 {events.length}개</p>
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 text-sm">조건에 맞는 이벤트가 없어요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {events.map((event) => (
              <EventCard key={event.id} event={JSON.parse(JSON.stringify(event))} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
