'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema, EventFormData } from '@/lib/validations'
import { Event } from '@/types'
import Script from 'next/script'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'

interface Props {
  initialData?: Event
  eventId?: string
}

export default function EventForm({ initialData, eventId }: Props) {
  const router = useRouter()
  const { showToast } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [previews, setPreviews] = useState<string[]>(initialData?.images ?? [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          category: initialData.category,
          address: initialData.address,
          addressDetail: initialData.addressDetail ?? '',
          lat: initialData.lat,
          lng: initialData.lng,
          district: initialData.district ?? '',
          startDate: initialData.startDate.split('T')[0],
          endDate: initialData.endDate.split('T')[0],
          openTime: initialData.openTime,
          closeTime: initialData.closeTime,
          requiresReservation: initialData.requiresReservation,
          images: initialData.images,
          artist: initialData.artist ?? '',
          benefits: initialData.benefits ?? '',
          snsTwitter: initialData.snsTwitter ?? '',
          snsInstagram: initialData.snsInstagram ?? '',
        }
      : { requiresReservation: false, images: [] },
  })

  const handleAddressSearch = () => {
    if (typeof window === 'undefined' || !window.daum) return
    new window.daum.Postcode({
      oncomplete: (data) => {
        const address = data.roadAddress || data.address
        setValue('address', address, { shouldValidate: true })

        if (window.kakao?.maps?.services) {
          const geocoder = new window.kakao.maps.services.Geocoder()
          geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              setValue('lat', parseFloat(result[0].y))
              setValue('lng', parseFloat(result[0].x))
              setValue('district', data.sigungu ?? '')
            }
          })
        }
      },
    }).open()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const current = watch('images') ?? []
    if (current.length + files.length > 5) {
      showToast('최대 5장까지 업로드할 수 있습니다', 'error')
      return
    }
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name}: 5MB 이하만 가능합니다`, 'error')
        continue
      }
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setValue('images', [...(watch('images') ?? []), url])
        setPreviews((p) => [...p, url])
      }
    }
  }

  const removeImage = (idx: number) => {
    setValue('images', (watch('images') ?? []).filter((_, i) => i !== idx))
    setPreviews((p) => p.filter((_, i) => i !== idx))
  }

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true)
    const res = await fetch(
      eventId ? `/api/operator/events/${eventId}` : '/api/operator/events',
      {
        method: eventId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    if (res.ok) {
      showToast(eventId ? '이벤트가 수정되었습니다!' : '이벤트가 등록되었습니다!')
      router.push('/operator/dashboard')
      router.refresh()
    } else {
      const err = await res.json()
      showToast(err.error ?? '오류가 발생했습니다', 'error')
    }
    setIsLoading(false)
  }

  const addressValue = watch('address')
  const categoryValue = watch('category')
  const reservationValue = watch('requiresReservation')

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
        strategy="lazyOnload"
        onLoad={() => window.kakao?.maps?.load(() => {})}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 py-5 pb-28">
        {/* 제목 */}
        <div>
          <label className="text-sm font-bold text-gray-800">제목 *</label>
          <input
            {...register('title')}
            maxLength={50}
            className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="이벤트 제목 (최대 50자)"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* 카테고리 */}
        <div>
          <label className="text-sm font-bold text-gray-800">카테고리 *</label>
          <div className="mt-1.5 flex gap-2">
            {(['birthday', 'exhibition', 'popup'] as const).map((cat) => {
              const labels = { birthday: '🩷 생일카페', exhibition: '🔮 전시회', popup: '🛍️ 팝업스토어' }
              return (
                <label key={cat} className="flex-1">
                  <input {...register('category')} type="radio" value={cat} className="sr-only" />
                  <div
                    className={`text-center py-2.5 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                      categoryValue === cat
                        ? 'border-pink-400 bg-pink-50 text-pink-600'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    {labels[cat]}
                  </div>
                </label>
              )
            })}
          </div>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>

        {/* 주소 */}
        <div>
          <label className="text-sm font-bold text-gray-800">주소 *</label>
          <button
            type="button"
            onClick={handleAddressSearch}
            className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm text-left flex items-center gap-2 bg-white"
          >
            <span>🔍</span>
            <span className={addressValue ? 'text-gray-800' : 'text-gray-400'}>
              {addressValue || '주소 검색하기'}
            </span>
          </button>
          {addressValue && (
            <input
              {...register('addressDetail')}
              className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="상세 주소 (예: 2층, B동)"
            />
          )}
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
        </div>

        {/* 운영 기간 */}
        <div>
          <label className="text-sm font-bold text-gray-800">운영 기간 *</label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              {...register('startDate')}
              type="date"
              className="flex-1 px-3 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <span className="text-gray-400 font-medium">~</span>
            <input
              {...register('endDate')}
              type="date"
              className="flex-1 px-3 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          {(errors.startDate || errors.endDate) && (
            <p className="mt-1 text-xs text-red-500">
              {errors.startDate?.message || errors.endDate?.message}
            </p>
          )}
        </div>

        {/* 운영 시간 */}
        <div>
          <label className="text-sm font-bold text-gray-800">운영 시간 *</label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              {...register('openTime')}
              type="text"
              placeholder="11:00"
              className="flex-1 px-3 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <span className="text-gray-400 font-medium">~</span>
            <input
              {...register('closeTime')}
              type="text"
              placeholder="21:00"
              className="flex-1 px-3 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        {/* 예약 */}
        <div>
          <label className="text-sm font-bold text-gray-800">예약 필요 여부 *</label>
          <div className="mt-1.5 flex gap-3">
            {([true, false] as const).map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setValue('requiresReservation', val)}
                className={`flex-1 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                  reservationValue === val
                    ? 'border-pink-400 bg-pink-50 text-pink-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                {val ? '예약 필수' : '예약 불필요'}
              </button>
            ))}
          </div>
        </div>

        {/* 이미지 */}
        <div>
          <label className="text-sm font-bold text-gray-800">이미지 (선택, 최대 5장)</label>
          <div className="mt-1.5 flex gap-2 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200">
                <Image src={src} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            {previews.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400"
              >
                <span className="text-2xl leading-none">+</span>
                <span className="text-xs mt-0.5">사진 추가</span>
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
        </div>

        {/* 아티스트 */}
        <div>
          <label className="text-sm font-bold text-gray-800">아티스트/IP (선택)</label>
          <input
            {...register('artist')}
            className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="예: 장원영 (IVE)"
          />
        </div>

        {/* 방문 특전 */}
        <div>
          <label className="text-sm font-bold text-gray-800">방문 특전 (선택)</label>
          <textarea
            {...register('benefits')}
            rows={3}
            className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            placeholder="특전 내용을 줄바꿈으로 구분하여 입력하세요"
          />
        </div>

        {/* SNS */}
        <div>
          <label className="text-sm font-bold text-gray-800">SNS 링크 (선택)</label>
          <div className="mt-1.5 space-y-2">
            <input
              {...register('snsTwitter')}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="트위터(X) URL"
            />
            <input
              {...register('snsInstagram')}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="인스타그램 URL"
            />
          </div>
        </div>
      </form>

      {/* 고정 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 py-4 bg-white border-t border-gray-100">
        <button
          form="event-form"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold text-base disabled:opacity-60 shadow-lg"
        >
          {isLoading ? '업데이트 중...' : '업데이트'}
        </button>
      </div>
    </>
  )
}
