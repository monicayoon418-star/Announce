import { EventStatus } from '@/types'

export function getDday(endDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')}`
}

export function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function getEventStatus(startDate: string, endDate: string): EventStatus {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)
  if (today < start) return 'hidden'
  if (today > end) return 'ended'
  return 'active'
}

export function getStatusLabel(status: EventStatus): string {
  return { active: '운영 중', ended: '종료', hidden: '대기' }[status]
}
