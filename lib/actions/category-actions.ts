'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSafeAction, ActionState } from './base-actions'
import { Category, ContentStatus } from '@prisma/client'
import { requireAdminAuth } from '@/lib/supabase/admin'

const createCategorySchema = z.object({
  name: z.string().min(1, '카테고리명을 입력해주세요').max(50),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.ACTIVE),
})

const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, '카테고리명을 입력해주세요').max(50).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
})

interface CategoryWithCount extends Category {
  _count: {
    menus: number
  }
}

export const getCategories = async (): Promise<CategoryWithCount[]> => {
  await requireAdminAuth()
  
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { menus: true },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  
  return categories
}

export const getCategory = async (id: string) => {
  await requireAdminAuth()
  
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      menus: true,
    },
  })
  
  return category
}

export const createCategory = createSafeAction(
  createCategorySchema,
  async (data): Promise<ActionState<Category>> => {
    await requireAdminAuth()
    
    try {
      // Check if category name already exists
      const existing = await prisma.category.findUnique({
        where: { name: data.name },
      })
      
      if (existing) {
        return {
          success: false,
          error: '이미 존재하는 카테고리명입니다',
        }
      }
      
      const category = await prisma.category.create({
        data,
      })
      
      revalidatePath('/admin/menus/categories')
      
      return {
        success: true,
        data: category,
      }
    } catch {
      return {
        success: false,
        error: '카테고리 생성에 실패했습니다',
      }
    }
  }
)

export const updateCategory = createSafeAction(
  updateCategorySchema,
  async (data): Promise<ActionState<Category>> => {
    await requireAdminAuth()
    
    const { id, ...updateData } = data
    
    try {
      // Check if new name already exists (if name is being updated)
      if (updateData.name) {
        const existing = await prisma.category.findFirst({
          where: {
            name: updateData.name,
            NOT: { id },
          },
        })
        
        if (existing) {
          return {
            success: false,
            error: '이미 존재하는 카테고리명입니다',
          }
        }
      }
      
      const category = await prisma.category.update({
        where: { id },
        data: updateData,
      })
      
      revalidatePath('/admin/menus/categories')
      
      return {
        success: true,
        data: category,
      }
    } catch {
      return {
        success: false,
        error: '카테고리 수정에 실패했습니다',
      }
    }
  }
)

export const deleteCategory = async (id: string): Promise<ActionState<void>> => {
  await requireAdminAuth()
  
  try {
    // Check if category has menus
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    })
    
    if (category && category._count.menus > 0) {
      return {
        success: false,
        error: '메뉴가 등록된 카테고리는 삭제할 수 없습니다',
      }
    }
    
    await prisma.category.delete({
      where: { id },
    })
    
    revalidatePath('/admin/menus/categories')
    
    return { success: true }
  } catch {
    return {
      success: false,
      error: '카테고리 삭제에 실패했습니다',
    }
  }
}