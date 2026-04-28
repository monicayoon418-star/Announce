'use client'

import { useStore } from '@/store/useStore'
import { AnimatePresence, motion } from 'framer-motion'

export default function Toast() {
  const { toast } = useStore()

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 40, x: '-50%' }}
          className={`fixed bottom-20 left-1/2 z-50 px-5 py-3 rounded-full text-white text-sm font-medium shadow-lg whitespace-nowrap ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-gray-900'
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
