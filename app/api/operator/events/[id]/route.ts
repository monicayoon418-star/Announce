import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { eventSchema } from '@/lib/validations'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const event = await prisma.event.findFirst({
    where: { id: params.id, operatorId: session.user.id },
  })
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const d = parsed.data
  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
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
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const event = await prisma.event.findFirst({
    where: { id: params.id, operatorId: session.user.id },
  })
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.event.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
