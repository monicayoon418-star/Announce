import Link from 'next/link'
import Image from 'next/image'
import { Event, CATEGORY_LABELS, CATEGORY_BG, CATEGORY_EMOJI } from '@/types'
import { formatDate, getDday } from '@/lib/utils'
import WishlistButton from './WishlistButton'

export default function EventCard({ event }: { event: Event }) {
  const dday = getDday(event.endDate)
  const isEnded = dday < 0

  return (
    <Link href={`/events/${event.id}`}>
      <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${isEnded ? 'opacity-60' : ''}`}>
        <div className="relative h-36 bg-gray-100">
          {event.images[0] ? (
            <Image src={event.images[0]} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-50 to-gray-100">
              {CATEGORY_EMOJI[event.category]}
            </div>
          )}
          <div className="absolute top-2 right-2">
            <WishlistButton eventId={event.id} size="sm" />
          </div>
          {!isEnded && dday <= 7 && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              D-{dday === 0 ? 'DAY' : dday}
            </div>
          )}
        </div>
        <div className="p-2.5">
          <div className="flex items-center gap-1 mb-1">
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_BG[event.category]}`}>
              {CATEGORY_LABELS[event.category]}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 leading-tight">{event.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{event.address}</p>
        </div>
      </div>
    </Link>
  )
}
