import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const events = await prisma.event.findMany({
    where: {
      status: { not: 'hidden' },
      ...(category ? { category: category as 'birthday' | 'exhibition' | 'popup' } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { artist: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { operator: { select: { name: true } } },
  })

  return NextResponse.json(events)
}
