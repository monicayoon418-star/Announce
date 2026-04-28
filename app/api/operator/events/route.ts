import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { eventSchema } from '@/lib/validations'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const events = await prisma.event.findMany({
    where: { operatorId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const d = parsed.data
  const event = await prisma.event.create({
    data: {
      operatorId: session.user.id,
      title: d.title,
      category: d.category,
      address: d.address,
      addressDetail: d.addressDetail || null,
      lat: d.lat,
      lng: d.lng,
      district: d.district || null,
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      openTime: d.openTime,
      closeTime: d.closeTime,
      requiresReservation: d.requiresReservation,
      images: d.images ?? [],
      artist: d.artist || null,
      benefits: d.benefits || null,
      snsTwitter: d.snsTwitter || null,
      snsInstagram: d.snsInstagram || null,
      status: 'active',
    },
  })

  return NextResponse.json(event, { status: 201 })
}
