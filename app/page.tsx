import { prisma } from '@/lib/prisma'
import MapClient from '@/components/map/MapClient'

export const dynamic = 'force-dynamic'

async function getActiveEvents() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return await prisma.event.findMany({
      where: { status: { not: 'hidden' }, endDate: { gte: today } },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const events = await getActiveEvents()

  return (
    <div className="flex flex-col bg-white" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-30">
        <h1 className="text-xl font-bold text-pink-500">어나운스</h1>
        <span className="ml-1.5 text-xs bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full font-medium">β</span>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <MapClient events={JSON.parse(JSON.stringify(events))} />
      </div>
    </div>
  )
}
