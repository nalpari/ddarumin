import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/supabase/server'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stores = await prisma.store.findMany({
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const store = await prisma.store.create({
      data: {
        name: data.name,
        region: data.region,
        address: data.address,
        additionalAddress: data.additionalAddress,
        phone: data.phone,
        operatingStatus: data.operatingStatus,
        storeType: data.storeType,
        options: data.options,
        images: data.images
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error('Failed to create store:', error)
    return NextResponse.json(
      { error: 'Failed to create store' },
      { status: 500 }
    )
  }
}