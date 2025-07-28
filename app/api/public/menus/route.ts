import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        category: true
      },
      orderBy: [
        { createdAt: 'desc' },
        { name: 'asc' }
      ]
    })
    
    // Transform menus to include additional properties
    const transformedMenus = menus.map(menu => ({
      ...menu,
      isPopular: menu.marketingTags.includes('BEST'),
      isNew: menu.marketingTags.includes('NEW'),
      isAvailable: menu.status === 'ACTIVE'
    }))

    return NextResponse.json(transformedMenus)
  } catch (error) {
    console.error('Failed to fetch menus:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    )
  }
}