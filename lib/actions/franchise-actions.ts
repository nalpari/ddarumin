'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSafeAction, ActionState } from './base-actions'
import { FranchiseInquiry, InquiryStatus, StoreOwnership } from '@prisma/client'
import { requireAdminAuth } from '@/lib/supabase/admin'

const updateInquirySchema = z.object({
  id: z.string(),
  status: z.nativeEnum(InquiryStatus),
  response: z.string().optional(),
})

export const getFranchiseInquiries = async (): Promise<FranchiseInquiry[]> => {
  await requireAdminAuth()
  
  const inquiries = await prisma.franchiseInquiry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  return inquiries
}

export const getFranchiseInquiry = async (id: string): Promise<FranchiseInquiry | null> => {
  await requireAdminAuth()
  
  const inquiry = await prisma.franchiseInquiry.findUnique({
    where: { id },
  })
  
  return inquiry
}

export const updateFranchiseInquiry = createSafeAction(
  updateInquirySchema,
  async (data): Promise<ActionState<FranchiseInquiry>> => {
    await requireAdminAuth()
    
    try {
      const inquiry = await prisma.franchiseInquiry.update({
        where: { id: data.id },
        data: {
          status: data.status,
          response: data.response,
        },
      })
      
      revalidatePath('/admin/franchise')
      
      return {
        success: true,
        data: inquiry,
      }
    } catch (error) {
      return {
        success: false,
        error: '가맹문의 상태 업데이트에 실패했습니다',
      }
    }
  }
)

export const deleteFranchiseInquiry = async (id: string): Promise<ActionState<void>> => {
  await requireAdminAuth()
  
  try {
    await prisma.franchiseInquiry.delete({
      where: { id },
    })
    
    revalidatePath('/admin/franchise')
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: '가맹문의 삭제에 실패했습니다',
    }
  }
}