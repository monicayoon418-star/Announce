'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Event, Category } from '@/types'

interface AppStore {
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void
  selectedCategory: Category | null
  setSelectedCategory: (category: Category | null) => void
  guestWishlist: string[]
  toggleGuestWishlist: (eventId: string) => void
  isInGuestWishlist: (eventId: string) => boolean
  toast: { message: string; type: 'success' | 'error' } | null
  showToast: (message: string, type?: 'success' | 'error') => void
  clearToast: () => void
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      selectedEvent: null,
      setSelectedEvent: (event) => set({ selectedEvent: event }),

      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      guestWishlist: [],
      toggleGuestWishlist: (eventId) => {
        const list = get().guestWishlist
        set({
          guestWishlist: list.includes(eventId)
            ? list.filter((id) => id !== eventId)
            : [...list, eventId],
        })
      },
      isInGuestWishlist: (eventId) => get().guestWishlist.includes(eventId),

      toast: null,
      showToast: (message, type = 'success') => {
        set({ toast: { message, type } })
        setTimeout(() => set({ toast: null }), 3000)
      },
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'announce-store',
      partialize: (state) => ({ guestWishlist: state.guestWishlist }),
    }
  )
)
