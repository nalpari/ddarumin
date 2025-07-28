import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const franchiseInquiry = await prisma.franchiseInquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        region: data.region,
        ageGroup: '30-40', // Default value
        storeOwnership: 'NONE', // Default value
        brandAwareness: ['ONLINE'], // Default value
        availableTime: '오전', // Default value
        content: data.message
      }
    })

    return NextResponse.json(franchiseInquiry)
  } catch (error) {
    console.error('Failed to create franchise inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}