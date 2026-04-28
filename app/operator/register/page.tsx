'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/lib/validations'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function OperatorRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError('')

    const res = await fetch('/api/operator/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok) {
      setError(result.error ?? '오류가 발생했습니다')
      setIsLoading(false)
      return
    }

    // 회원가입 성공 후 자동 로그인
    const loginResult = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (loginResult?.error) {
      router.push('/operator/login?registered=true')
    } else {
      router.push('/operator/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <p className="text-3xl mb-2">📣</p>
          <h1 className="text-2xl font-bold text-gray-900">운영자 회원가입</h1>
          <p className="text-gray-400 text-sm mt-1">이벤트 등록·관리 계정</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">운영자명 / 팬카페명</label>
            <input
              {...register('name')}
              className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="예: 장원영 팬카페"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">이메일</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="email@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">비밀번호</label>
            <input
              {...register('password')}
              type="password"
              className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="8자 이상"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-2xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-pink-500 text-white rounded-2xl font-bold text-sm disabled:opacity-60 mt-2"
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link href="/operator/login" className="text-pink-500 font-semibold">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
