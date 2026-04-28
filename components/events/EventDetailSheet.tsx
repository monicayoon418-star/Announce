'use client'

import { useStore } from '@/store/useStore'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CATEGORY_LABELS, CATEGORY_BG, CATEGORY_EMOJI } from '@/types'
import { getDday, formatFullDate } from '@/lib/utils'
import WishlistButton from './WishlistButton'

export default function EventDetailSheet() {
  const { selectedEvent, setSelectedEvent } = useStore()

  return (
    <AnimatePresence>
      {selectedEvent && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto z-50 bg-white rounded-t-3xl overflow-hidden max-h-[75vh] overflow-y-auto"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-0" />

            <div className="relative h-48 bg-gray-100">
              {selectedEvent.images[0] ? (
                <Image src={selectedEvent.images[0]} alt={selectedEvent.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-pink-50 to-purple-50">
                  {CATEGORY_EMOJI[selectedEvent.category]}
                </div>
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_BG[selectedEvent.category]}`}>
                      {CATEGORY_LABELS[selectedEvent.category]}
                    </span>
                    {selectedEvent.requiresReservation && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">예약 필수</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedEvent.title}</h2>
                  {selectedEvent.artist && (
                    <p className="text-sm text-gray-500 mt-0.5">{selectedEvent.artist}</p>
                  )}
                </div>
                <WishlistButton eventId={selectedEvent.id} />
              </div>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>
                    {formatFullDate(selectedEvent.startDate)} ~ {formatFullDate(selectedEvent.endDate)}
                  </span>
                  {getDday(selectedEvent.endDate) >= 0 && (
                    <span className="text-pink-500 font-semibold">
                      D-{getDday(selectedEvent.endDate) === 0 ? 'DAY' : getDday(selectedEvent.endDate)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{selectedEvent.openTime} ~ {selectedEvent.closeTime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>📍</span>
                  <span className="line-clamp-2">{selectedEvent.address}</span>
                </div>
              </div>

              <Link
                href={`/events/${selectedEvent.id}`}
                className="mt-4 block w-full py-3 bg-pink-500 text-white text-center rounded-2xl font-semibold text-sm"
              >
                자세히 보기 →
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
