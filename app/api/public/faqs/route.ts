import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Transform the data to match the frontend expectations
    const transformedFaqs = faqs.map(faq => ({
      id: faq.id,
      category: faq.category,
      title: faq.title,
      content: faq.content,
      question: faq.title, // For backward compatibility
      answer: faq.content  // For backward compatibility
    }))

    return NextResponse.json(transformedFaqs)
  } catch (error) {
    console.error('Failed to fetch FAQs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}