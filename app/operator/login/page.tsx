'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/validations'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const registered = searchParams.get('registered')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
      setIsLoading(false)
    } else {
      router.push('/operator/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <p className="text-3xl mb-2">📣</p>
          <h1 className="text-2xl font-bold text-gray-900">운영자 로그인</h1>
          <p className="text-gray-400 text-sm mt-1">어나운스 이벤트 관리</p>
        </div>

        {registered && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-2xl text-center">
            회원가입 완료! 로그인해주세요
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="비밀번호 입력"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-pink-500 text-white rounded-2xl font-bold text-sm disabled:opacity-60 mt-2"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          계정이 없으신가요?{' '}
          <Link href="/operator/register" className="text-pink-500 font-semibold">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function OperatorLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
