import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Create a generic franchise inquiry for startup sessions
    const franchiseInquiry = await prisma.franchiseInquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        region: '미정',
        ageGroup: '30-40',
        storeOwnership: 'NONE',
        brandAwareness: ['STARTUP_SESSION'],
        availableTime: '오전',
        content: `창업설명회 신청 - 세션: ${data.sessionId}, 참석인원: ${data.participants}명`
      }
    })

    return NextResponse.json(franchiseInquiry)
  } catch (error) {
    console.error('Failed to create startup session:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}