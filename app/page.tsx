import { prisma } from '@/lib/prisma'
import MapClient from '@/components/map/MapClient'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getActiveEvents() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return prisma.event.findMany({
    where: { status: { not: 'hidden' }, endDate: { gte: today } },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function HomePage() {
  const events = await getActiveEvents()

  return (
    <div className="relative h-screen bg-gray-100 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-pink-500">어나운스</h1>
            <span className="text-xs bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full font-medium">β</span>
          </div>
          <Link href="/explore" className="text-sm text-gray-500 flex items-center gap-1">
            <span>🔍</span>
            <span>탐색</span>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 top-14">
        <MapClient events={JSON.parse(JSON.stringify(events))} />
      </div>
    </div>
  )
}
