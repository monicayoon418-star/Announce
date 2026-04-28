'use client'

import { useSession } from 'next-auth/react'
import { useStore } from '@/store/useStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  eventId: string
  size?: 'sm' | 'md'
}

export default function WishlistButton({ eventId, size = 'md' }: Props) {
  const { data: session } = useSession()
  const { isInGuestWishlist, toggleGuestWishlist, showToast } = useStore()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await fetch('/api/wishlist')
      if (!res.ok) return { ids: [] as string[] }
      return res.json() as Promise<{ ids: string[] }>
    },
    enabled: !!session,
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const inList = data?.ids?.includes(eventId)
      await fetch('/api/wishlist', {
        method: inList ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
    onError: () => showToast('오류가 발생했습니다', 'error'),
  })

  const isLiked = session ? data?.ids?.includes(eventId) : isInGuestWishlist(eventId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (session) {
      mutation.mutate()
    } else {
      toggleGuestWishlist(eventId)
      showToast(isLiked ? '찜을 취소했습니다' : '찜했습니다!')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`${size === 'md' ? 'w-9 h-9 text-xl' : 'w-7 h-7 text-base'} rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-sm active:scale-90 transition-transform`}
      aria-label={isLiked ? '찜 취소' : '찜하기'}
    >
      {isLiked ? '❤️' : '🤍'}
    </button>
  )
}
