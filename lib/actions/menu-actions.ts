'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSafeAction, ActionState } from './base-actions'
import { Menu, ContentStatus, MarketingTag, Temperature } from '@prisma/client'
import { requireAdminAuth } from '@/lib/supabase/admin'

const createMenuSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(1, '메뉴명을 입력해주세요').max(100),
  price: z.number().int().positive('가격은 0보다 커야 합니다'),
  discountPrice: z.number().int().positive().optional().nullable(),
  marketingTags: z.array(z.nativeEnum(MarketingTag)).default([]),
  hotColdOptions: z.array(z.nativeEnum(Temperature)).default([]),
  description: z.string().min(1, '설명을 입력해주세요'),
  imageUrl: z.string().optional().nullable(),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.ACTIVE),
})

const updateMenuSchema = z.object({
  id: z.string(),
  categoryId: z.string().optional(),
  name: z.string().min(1, '메뉴명을 입력해주세요').max(100).optional(),
  price: z.number().int().positive('가격은 0보다 커야 합니다').optional(),
  discountPrice: z.number().int().positive().optional().nullable(),
  marketingTags: z.array(z.nativeEnum(MarketingTag)).optional(),
  hotColdOptions: z.array(z.nativeEnum(Temperature)).optional(),
  description: z.string().min(1, '설명을 입력해주세요').optional(),
  imageUrl: z.string().optional().nullable(),
  status: z.nativeEnum(ContentStatus).optional(),
})

export const getMenus = async () => {
  await requireAdminAuth()
  
  const menus = await prisma.menu.findMany({
    include: {
      category: true,
    },
    orderBy: [
      { category: { name: 'asc' } },
      { createdAt: 'desc' },
    ],
  })
  
  return menus
}

export const getMenu = async (id: string) => {
  await requireAdminAuth()
  
  const menu = await prisma.menu.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })
  
  return menu
}

export const getMenusByCategory = async (categoryId: string) => {
  await requireAdminAuth()
  
  const menus = await prisma.menu.findMany({
    where: { categoryId },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  return menus
}

export const createMenu = createSafeAction(
  createMenuSchema,
  async (data): Promise<ActionState<Menu>> => {
    await requireAdminAuth()
    
    try {
      const menu = await prisma.menu.create({
        data: {
          ...data,
          discountPrice: data.discountPrice || null,
          imageUrl: data.imageUrl || null,
        },
      })
      
      revalidatePath('/admin/menus/items')
      
      return {
        success: true,
        data: menu,
      }
    } catch (error) {
      return {
        success: false,
        error: '메뉴 생성에 실패했습니다',
      }
    }
  }
)

export const updateMenu = createSafeAction(
  updateMenuSchema,
  async (data): Promise<ActionState<Menu>> => {
    await requireAdminAuth()
    
    const { id, ...updateData } = data
    
    try {
      const menu = await prisma.menu.update({
        where: { id },
        data: {
          ...updateData,
          discountPrice: updateData.discountPrice === undefined ? undefined : updateData.discountPrice || null,
          imageUrl: updateData.imageUrl === undefined ? undefined : updateData.imageUrl || null,
        },
      })
      
      revalidatePath('/admin/menus/items')
      
      return {
        success: true,
        data: menu,
      }
    } catch (error) {
      return {
        success: false,
        error: '메뉴 수정에 실패했습니다',
      }
    }
  }
)

export const deleteMenu = async (id: string): Promise<ActionState<void>> => {
  await requireAdminAuth()
  
  try {
    await prisma.menu.delete({
      where: { id },
    })
    
    revalidatePath('/admin/menus/items')
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: '메뉴 삭제에 실패했습니다',
    }
  }
}