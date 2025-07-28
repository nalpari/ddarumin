import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test Prisma connection
    const adminCount = await prisma.admin.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      adminCount,
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}