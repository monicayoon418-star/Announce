import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ids: [] })

  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    select: { eventId: true },
  })

  return NextResponse.json({ ids: items.map((w) => w.eventId) })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { eventId } = await request.json()

  await prisma.user.upsert({
    where: { id: session.user.id },
    update: {},
    create: { id: session.user.id, email: session.user.email, name: session.user.name },
  })

  await prisma.wishlist.upsert({
    where: { userId_eventId: { userId: session.user.id, eventId } },
    update: {},
    create: { userId: session.user.id, eventId },
  })

  await prisma.event.update({
    where: { id: eventId },
    data: { likeCount: { increment: 1 } },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { eventId } = await request.json()

  await prisma.wishlist.deleteMany({ where: { userId: session.user.id, eventId } })

  await prisma.event.update({
    where: { id: eventId },
    data: { likeCount: { decrement: 1 } },
  })

  return NextResponse.json({ success: true })
}
