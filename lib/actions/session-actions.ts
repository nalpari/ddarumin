'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createSafeAction, ActionState } from './base-actions'
import { StartupSession, SessionStatus, SessionLocation } from '@prisma/client'
import { requireAdminAuth } from '@/lib/supabase/admin'

const createSessionSchema = z.object({
  round: z.number().int().positive(),
  sessionDate: z.string(),
  sessionTime: z.string(),
  location: z.nativeEnum(SessionLocation),
  additionalLocation: z.string().optional(),
  registrationStart: z.string(),
  registrationEnd: z.string(),
})

const updateSessionSchema = z.object({
  id: z.string(),
  sessionDate: z.string().optional(),
  sessionTime: z.string().optional(),
  location: z.nativeEnum(SessionLocation).optional(),
  additionalLocation: z.string().optional(),
  registrationStart: z.string().optional(),
  registrationEnd: z.string().optional(),
  status: z.nativeEnum(SessionStatus).optional(),
})

interface SessionWithCount extends StartupSession {
  _count: {
    applicants: number
  }
}

export const getStartupSessions = async (): Promise<SessionWithCount[]> => {
  await requireAdminAuth()
  
  const sessions = await prisma.startupSession.findMany({
    include: {
      _count: {
        select: { applicants: true },
      },
    },
    orderBy: {
      sessionDate: 'desc',
    },
  })
  
  return sessions
}

export const getStartupSession = async (id: string) => {
  await requireAdminAuth()
  
  const session = await prisma.startupSession.findUnique({
    where: { id },
    include: {
      applicants: true,
      _count: {
        select: { applicants: true },
      },
    },
  })
  
  return session
}

export const createStartupSession = createSafeAction(
  createSessionSchema,
  async (data): Promise<ActionState<StartupSession>> => {
    await requireAdminAuth()
    
    try {
      // Check if round already exists
      const existingSession = await prisma.startupSession.findUnique({
        where: { round: data.round },
      })
      
      if (existingSession) {
        return {
          success: false,
          error: '이미 존재하는 회차입니다',
        }
      }
      
      const session = await prisma.startupSession.create({
        data: {
          round: data.round,
          sessionDate: new Date(data.sessionDate),
          sessionTime: data.sessionTime,
          location: data.location,
          additionalLocation: data.additionalLocation,
          registrationStart: new Date(data.registrationStart),
          registrationEnd: new Date(data.registrationEnd),
        },
      })
      
      revalidatePath('/admin/sessions')
      
      return {
        success: true,
        data: session,
      }
    } catch {
      return {
        success: false,
        error: '창업설명회 생성에 실패했습니다',
      }
    }
  }
)

export const updateStartupSession = createSafeAction(
  updateSessionSchema,
  async (data): Promise<ActionState<StartupSession>> => {
    await requireAdminAuth()
    
    try {
      const updateData: Partial<StartupSession> = {}
      
      if (data.sessionDate) updateData.sessionDate = new Date(data.sessionDate)
      if (data.sessionTime) updateData.sessionTime = data.sessionTime
      if (data.location) updateData.location = data.location
      if (data.additionalLocation !== undefined) updateData.additionalLocation = data.additionalLocation
      if (data.registrationStart) updateData.registrationStart = new Date(data.registrationStart)
      if (data.registrationEnd) updateData.registrationEnd = new Date(data.registrationEnd)
      if (data.status) updateData.status = data.status
      
      const session = await prisma.startupSession.update({
        where: { id: data.id },
        data: updateData,
      })
      
      revalidatePath('/admin/sessions')
      
      return {
        success: true,
        data: session,
      }
    } catch {
      return {
        success: false,
        error: '창업설명회 수정에 실패했습니다',
      }
    }
  }
)

export const deleteStartupSession = async (id: string): Promise<ActionState<void>> => {
  await requireAdminAuth()
  
  try {
    await prisma.startupSession.delete({
      where: { id },
    })
    
    revalidatePath('/admin/sessions')
    
    return { success: true }
  } catch {
    return {
      success: false,
      error: '창업설명회 삭제에 실패했습니다',
    }
  }
}

export const getSessionApplicants = async (sessionId: string) => {
  await requireAdminAuth()
  
  const applicants = await prisma.sessionApplicant.findMany({
    where: { sessionId },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  return applicants
}

export const deleteSessionApplicant = async (id: string): Promise<ActionState<void>> => {
  await requireAdminAuth()
  
  try {
    await prisma.sessionApplicant.delete({
      where: { id },
    })
    
    revalidatePath('/admin/sessions')
    
    return { success: true }
  } catch {
    return {
      success: false,
      error: '신청자 삭제에 실패했습니다',
    }
  }
}