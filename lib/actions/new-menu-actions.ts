'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSafeAction, ActionState } from './base-actions'
import { NewMenu, NewMenuStatus } from '@prisma/client'
import { requireAdminAuth } from '@/lib/supabase/admin'

const createNewMenuSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200),
  startDate: z.string(),
  endDate: z.string(),
  imageUrl: z.string().min(1, '이미지를 업로드해주세요'),
})

const updateNewMenuSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '제목을 입력해주세요').max(200).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.nativeEnum(NewMenuStatus).optional(),
})

export const getNewMenus = async (): Promise<NewMenu[]> => {
  await requireAdminAuth()
  
  const newMenus = await prisma.newMenu.findMany({
    orderBy: {
      startDate: 'desc',
    },
  })
  
  // Auto-update status based on dates
  const now = new Date()
  for (const menu of newMenus) {
    let newStatus: NewMenuStatus | null = null
    
    if (menu.status !== 'EXPIRED' && new Date(menu.endDate) < now) {
      newStatus = 'EXPIRED'
    } else if (menu.status === 'WAITING' && new Date(menu.startDate) <= now && new Date(menu.endDate) >= now) {
      newStatus = 'ACTIVE'
    }
    
    if (newStatus) {
      await prisma.newMenu.update({
        where: { id: menu.id },
        data: { status: newStatus },
      })
      menu.status = newStatus
    }
  }
  
  return newMenus
}

export const getActiveNewMenus = async (): Promise<NewMenu[]> => {
  await requireAdminAuth()
  
  const now = new Date()
  const newMenus = await prisma.newMenu.findMany({
    where: {
      status: 'ACTIVE',
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: {
      startDate: 'desc',
    },
  })
  
  return newMenus
}

export const createNewMenu = createSafeAction(
  createNewMenuSchema,
  async (data): Promise<ActionState<NewMenu>> => {
    await requireAdminAuth()
    
    try {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      const now = new Date()
      
      // Determine initial status
      let status: NewMenuStatus = 'WAITING'
      if (endDate < now) {
        status = 'EXPIRED'
      } else if (startDate <= now && endDate >= now) {
        status = 'ACTIVE'
      }
      
      const newMenu = await prisma.newMenu.create({
        data: {
          ...data,
          startDate,
          endDate,
          status,
        },
      })
      
      revalidatePath('/admin/menus/new-menus')
      
      return {
        success: true,
        data: newMenu,
      }
    } catch {
      return {
        success: false,
        error: '신메뉴 포스터 생성에 실패했습니다',
      }
    }
  }
)

export const updateNewMenu = createSafeAction(
  updateNewMenuSchema,
  async (data): Promise<ActionState<NewMenu>> => {
    await requireAdminAuth()
    
    const { id, ...updateData } = data
    
    try {
      const processedData: Partial<NewMenu> = { ...updateData }
      
      if (updateData.startDate) processedData.startDate = new Date(updateData.startDate)
      if (updateData.endDate) processedData.endDate = new Date(updateData.endDate)
      
      // Update status if dates changed
      if (updateData.startDate || updateData.endDate) {
        const existing = await prisma.newMenu.findUnique({ where: { id } })
        if (existing) {
          const startDate = processedData.startDate || existing.startDate
          const endDate = processedData.endDate || existing.endDate
          const now = new Date()
          
          if (endDate < now) {
            processedData.status = 'EXPIRED'
          } else if (startDate <= now && endDate >= now) {
            processedData.status = 'ACTIVE'
          } else {
            processedData.status = 'WAITING'
          }
        }
      }
      
      const newMenu = await prisma.newMenu.update({
        where: { id },
        data: processedData,
      })
      
      revalidatePath('/admin/menus/new-menus')
      
      return {
        success: true,
        data: newMenu,
      }
    } catch {
      return {
        success: false,
        error: '신메뉴 포스터 수정에 실패했습니다',
      }
    }
  }
)

export const deleteNewMenu = async (id: string): Promise<ActionState<void>> => {
  await requireAdminAuth()
  
  try {
    await prisma.newMenu.delete({
      where: { id },
    })
    
    revalidatePath('/admin/menus/new-menus')
    
    return { success: true }
  } catch {
    return {
      success: false,
      error: '신메뉴 포스터 삭제에 실패했습니다',
    }
  }
}