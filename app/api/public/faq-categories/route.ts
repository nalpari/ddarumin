import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Since FAQCategory is an enum, return a static array
    const categories = [
      { id: 'STORE', name: '매장' },
      { id: 'MENU', name: '메뉴' },
      { id: 'STARTUP', name: '창업' },
      { id: 'SMART_ORDER', name: '스마트오더' }
    ]

    return NextResponse.json(categories)
  } catch {
    console.error('Failed to fetch FAQ categories')
    return NextResponse.json(
      { error: 'Failed to fetch FAQ categories' },
      { status: 500 }
    )
  }
}