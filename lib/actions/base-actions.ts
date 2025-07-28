'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export type ActionState<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export function createSafeAction<Input, Output>(
  schema: z.ZodSchema<Input>,
  handler: (validatedData: Input) => Promise<ActionState<Output>>
) {
  return async (data: Input): Promise<ActionState<Output>> => {
    const validationResult = schema.safeParse(data)

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
      }
    }

    try {
      return await handler(validationResult.data)
    } catch (error) {
      console.error('Action error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
      }
    }
  }
}

export function revalidatePathAction(path: string) {
  revalidatePath(path)
}

export function redirectAction(path: string) {
  redirect(path)
}

// Generic CRUD actions factory
export function createCRUDActions<T extends { id: string }>(
  modelName: string,
  basePath: string
) {
  return {
    async create(data: Omit<T, 'id'>): Promise<ActionState<T>> {
      try {
        // Implementation will be added based on specific model requirements
        return {
          success: true,
          data: { ...data, id: 'generated-id' } as T,
        }
      } catch {
        return {
          success: false,
          error: `${modelName} 생성에 실패했습니다`,
        }
      }
    },

    async update(id: string, data: Partial<T>): Promise<ActionState<T>> {
      try {
        // Implementation will be added based on specific model requirements
        return {
          success: true,
          data: { ...data, id } as T,
        }
      } catch {
        return {
          success: false,
          error: `${modelName} 수정에 실패했습니다`,
        }
      }
    },

    async delete(_id: string): Promise<ActionState<void>> {
      try {
        // Implementation will be added based on specific model requirements
        revalidatePath(basePath)
        return { success: true }
      } catch {
        return {
          success: false,
          error: `${modelName} 삭제에 실패했습니다`,
        }
      }
    },

    async getAll(): Promise<ActionState<T[]>> {
      try {
        // Implementation will be added based on specific model requirements
        return {
          success: true,
          data: [],
        }
      } catch {
        return {
          success: false,
          error: `${modelName} 목록을 불러오는데 실패했습니다`,
        }
      }
    },

    async getById(id: string): Promise<ActionState<T>> {
      try {
        // Implementation will be added based on specific model requirements
        return {
          success: true,
          data: { id } as T,
        }
      } catch {
        return {
          success: false,
          error: `${modelName}을(를) 찾을 수 없습니다`,
        }
      }
    },
  }
}