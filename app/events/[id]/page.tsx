import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABELS, CATEGORY_BG, CATEGORY_EMOJI } from '@/types'
import { formatFullDate, getDday } from '@/lib/utils'
import WishlistButton from '@/components/events/WishlistButton'

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { operator: { select: { name: true } } },
  })

  if (!event) notFound()

  await prisma.event.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } })

  const dday = getDday(event.endDate.toISOString())
  const isEnded = dday < 0

  return (
    <div className="min-h-screen bg-white pb-8">
      <div className="relative h-72 bg-gray-100">
        {event.images[0] ? (
          <Image src={event.images[0]} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-pink-50 to-purple-50">
            {CATEGORY_EMOJI[event.category]}
          </div>
        )}
        <Link
          href="/"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-lg"
        >
          ←
        </Link>
        <div className="absolute top-4 right-4">
          <WishlistButton eventId={event.id} />
        </div>
        {isEnded && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xl font-bold bg-black/60 px-4 py-2 rounded-full">종료된 이벤트</span>
          </div>
        )}
        {event.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            +{event.images.length - 1}
          </div>
        )}
      </div>

      <div className="px-4 py-5">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_BG[event.category]}`}>
            {CATEGORY_LABELS[event.category]}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full ${event.requiresReservation ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            {event.requiresReservation ? '예약 필수' : '예약 불필요'}
          </span>
          {!isEnded && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-500 font-semibold">
              D-{dday === 0 ? 'DAY' : dday}
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
        {event.artist && <p className="text-sm text-gray-500 mt-1">아티스트/IP: {event.artist}</p>}

        <div className="mt-5 space-y-3.5">
          <InfoRow icon="📅" label="운영 기간">
            {formatFullDate(event.startDate.toISOString())} ~ {formatFullDate(event.endDate.toISOString())}
          </InfoRow>
          <InfoRow icon="🕐" label="운영 시간">
            {event.openTime} ~ {event.closeTime}
          </InfoRow>
          <InfoRow icon="📍" label="주소">
            <div>
              <p>{event.address}</p>
              {event.addressDetail && <p className="text-gray-400 text-xs mt-0.5">{event.addressDetail}</p>}
            </div>
          </InfoRow>
        </div>

        {event.benefits && (
          <div className="mt-5 p-4 bg-pink-50 rounded-2xl">
            <p className="text-xs font-bold text-pink-600 mb-1.5">🎁 방문 특전</p>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{event.benefits}</p>
          </div>
        )}

        {(event.snsTwitter || event.snsInstagram) && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-400 mb-2">SNS</p>
            <div className="flex gap-2">
              {event.snsTwitter && (
                <a href={event.snsTwitter} target="_blank" rel="noreferrer"
                  className="px-4 py-2 bg-black text-white text-xs rounded-full font-medium">
                  𝕏 Twitter
                </a>
              )}
              {event.snsInstagram && (
                <a href={event.snsInstagram} target="_blank" rel="noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium">
                  📸 Instagram
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>주최: {event.operator.name}</span>
          <div className="flex gap-3">
            <span>👀 {event.viewCount}</span>
            <span>❤️ {event.likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="text-base mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <div className="text-sm text-gray-800">{children}</div>
      </div>
    </div>
  )
}
