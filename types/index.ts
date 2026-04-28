export type Category = 'birthday' | 'exhibition' | 'popup'
export type EventStatus = 'active' | 'ended' | 'hidden'

export interface Event {
  id: string
  operatorId: string
  title: string
  category: Category
  address: string
  addressDetail?: string | null
  lat: number
  lng: number
  district?: string | null
  startDate: string
  endDate: string
  openTime: string
  closeTime: string
  requiresReservation: boolean
  images: string[]
  artist?: string | null
  benefits?: string | null
  snsTwitter?: string | null
  snsInstagram?: string | null
  viewCount: number
  likeCount: number
  status: EventStatus
  createdAt: string
  updatedAt: string
  operator?: { id: string; name: string; email?: string }
}

export const CATEGORY_LABELS: Record<Category, string> = {
  birthday: '생일카페',
  exhibition: '전시회',
  popup: '팝업스토어',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  birthday: '#FF6B9D',
  exhibition: '#8B5CF6',
  popup: '#F97316',
}

export const CATEGORY_BG: Record<Category, string> = {
  birthday: 'bg-pink-100 text-pink-700',
  exhibition: 'bg-purple-100 text-purple-700',
  popup: 'bg-orange-100 text-orange-700',
}

export const CATEGORY_EMOJI: Record<Category, string> = {
  birthday: '🩷',
  exhibition: '🔮',
  popup: '🛍️',
}
