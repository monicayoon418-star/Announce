import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EventForm from '@/components/operator/EventForm'
import Link from 'next/link'

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/operator/login')

  const event = await prisma.event.findFirst({
    where: { id: params.id, operatorId: session.user.id },
  })

  if (!event) notFound()

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/operator/dashboard" className="text-gray-500 text-xl">←</Link>
        <h1 className="text-lg font-bold text-gray-900">이벤트 수정</h1>
      </div>
      <EventForm initialData={JSON.parse(JSON.stringify(event))} eventId={event.id} />
    </div>
  )
}
