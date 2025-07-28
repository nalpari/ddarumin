import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 공개된 매장만 조회 (운영중인 매장)
    const stores = await prisma.store.findMany({
      where: {
        operatingStatus: {
          in: ['OPEN', 'PREPARING', 'VACATION']
        }
      },
      orderBy: [
        { region: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(stores)
  } catch (error) {
    console.error('Failed to fetch stores:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}