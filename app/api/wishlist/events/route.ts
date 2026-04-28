import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json([])

  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      event: { include: { operator: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(items.map((w) => w.event))
}
