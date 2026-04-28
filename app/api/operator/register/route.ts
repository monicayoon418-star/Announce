import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { email, password, name } = parsed.data

  const existing = await prisma.operator.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: '이미 등록된 이메일입니다' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const operator = await prisma.operator.create({
    data: { email, passwordHash, name },
    select: { id: true, email: true, name: true },
  })

  return NextResponse.json(operator, { status: 201 })
}
