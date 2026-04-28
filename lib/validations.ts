import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(50, '제목은 50자 이내로 입력해주세요'),
  category: z.enum(['birthday', 'exhibition', 'popup'], {
    errorMap: () => ({ message: '카테고리를 선택해주세요' }),
  }),
  address: z.string().min(1, '주소를 검색해주세요'),
  addressDetail: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  district: z.string().optional(),
  startDate: z.string().min(1, '시작일을 선택해주세요'),
  endDate: z.string().min(1, '종료일을 선택해주세요'),
  openTime: z.string().min(1, '운영 시작 시간을 입력해주세요'),
  closeTime: z.string().min(1, '운영 종료 시간을 입력해주세요'),
  requiresReservation: z.boolean(),
  images: z.array(z.string()).optional().default([]),
  artist: z.string().optional(),
  benefits: z.string().optional(),
  snsTwitter: z.string().url('유효한 URL을 입력해주세요').optional().or(z.literal('')),
  snsInstagram: z.string().url('유효한 URL을 입력해주세요').optional().or(z.literal('')),
})

export type EventFormData = z.infer<typeof eventSchema>

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  name: z.string().min(1, '운영자명을 입력해주세요'),
})

export type RegisterFormData = z.infer<typeof registerSchema>
