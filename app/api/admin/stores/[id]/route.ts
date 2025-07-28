import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/supabase/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const store = await prisma.store.update({
      where: { id: params.id },
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
    console.error('Failed to update store:', error)
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 먼저 이벤트와의 연결을 해제
    await prisma.eventStore.deleteMany({
      where: { storeId: params.id }
    })

    // 매장 삭제
    await prisma.store.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete store:', error)
    return NextResponse.json(
      { error: 'Failed to delete store' },
      { status: 500 }
    )
  }
}