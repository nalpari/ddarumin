'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSafeAction, ActionState } from './base-actions'
import { FAQ, FAQCategory, ContentStatus } from '@prisma/client'
import { requireAdminAuth } from '@/lib/supabase/admin'

const createFAQSchema = z.object({
  category: z.nativeEnum(FAQCategory),
  title: z.string().min(1, '제목을 입력해주세요').max(200),
  content: z.string().min(1, '내용을 입력해주세요'),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.ACTIVE),
})

const updateFAQSchema = z.object({
  id: z.string(),
  category: z.nativeEnum(FAQCategory).optional(),
  title: z.string().min(1, '제목을 입력해주세요').max(200).optional(),
  content: z.string().min(1, '내용을 입력해주세요').optional(),
  status: z.nativeEnum(ContentStatus).optional(),
})

export const getFAQs = async (): Promise<FAQ[]> => {
  await requireAdminAuth()
  
  const faqs = await prisma.fAQ.findMany({
    orderBy: [
      { category: 'asc' },
      { createdAt: 'desc' },
    ],
  })
  
  return faqs
}

export const getFAQ = async (id: string): Promise<FAQ | null> => {
  await requireAdminAuth()
  
  const faq = await prisma.fAQ.findUnique({
    where: { id },
  })
  
  return faq
}

export const createFAQ = createSafeAction(
  createFAQSchema,
  async (data): Promise<ActionState<FAQ>> => {
    await requireAdminAuth()
    
    try {
      const faq = await prisma.fAQ.create({
        data,
      })
      
      revalidatePath('/admin/posts/faqs')
      
      return {
        success: true,
        data: faq,
      }
    } catch {
      return {
        success: false,
        error: 'FAQ 생성에 실패했습니다',
      }
    }
  }
)

export const updateFAQ = createSafeAction(
  updateFAQSchema,
  async (data): Promise<ActionState<FAQ>> => {
    await requireAdminAuth()
    
    const { id, ...updateData } = data
    
    try {
      const faq = await prisma.fAQ.update({
        where: { id },
        data: updateData,
      })
      
      revalidatePath('/admin/posts/faqs')
      
      return {
        success: true,
        data: faq,
      }
    } catch {
      return {
        success: false,
        error: 'FAQ 수정에 실패했습니다',
      }
    }
  }
)

export const deleteFAQ = async (id: string): Promise<ActionState<void>> => {
  await requireAdminAuth()
  
  try {
    await prisma.fAQ.delete({
      where: { id },
    })
    
    revalidatePath('/admin/posts/faqs')
    
    return { success: true }
  } catch {
    return {
      success: false,
      error: 'FAQ 삭제에 실패했습니다',
    }
  }
}