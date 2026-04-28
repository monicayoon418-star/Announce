import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/operator/login')

  const events = await prisma.event.findMany({
    where: { operatorId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">이벤트 카페 관리</h1>
          <p className="text-xs text-gray-400 mt-0.5">{session.user.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xs text-gray-400 px-3 py-1.5 border border-gray-200 rounded-full">
            지도 보기
          </Link>
          <Link
            href="/operator/events/new"
            className="px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-semibold"
          >
            + 새 이벤트
          </Link>
        </div>
      </div>

      <DashboardClient events={JSON.parse(JSON.stringify(events))} />
    </div>
  )
}
