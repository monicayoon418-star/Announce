import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const existing = await prisma.operator.findUnique({
      where: { email: 'hyoone100@naver.com' },
    })

    if (existing) {
      return NextResponse.json({ status: '이미 계정이 존재합니다' })
    }

    const passwordHash = await bcrypt.hash('hanyoonee418!', 12)
    await prisma.operator.create({
      data: {
        email: 'hyoone100@naver.com',
        passwordHash,
        name: '어나운스 운영자',
      },
    })

    return NextResponse.json({ status: '운영자 계정 생성 완료!' })
  } catch (error) {
    return NextResponse.json({ status: '오류', error: String(error) }, { status: 500 })
  }
}
