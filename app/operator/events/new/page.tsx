import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import EventForm from '@/components/operator/EventForm'
import Link from 'next/link'

export default async function NewEventPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/operator/login')

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/operator/dashboard" className="text-gray-500 text-xl">←</Link>
        <h1 className="text-lg font-bold text-gray-900">이벤트 등록</h1>
      </div>
      <EventForm />
    </div>
  )
}
