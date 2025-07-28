'use client'

import * as React from 'react'
import { type StorageBucket } from '@/lib/supabase/storage-config'
import { uploadFile, type UploadResult } from '@/lib/supabase/storage'

interface UploadTask {
  id: string
  file: File
  bucket: StorageBucket
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  result?: UploadResult
  error?: string
}

interface ImageUploadContextType {
  tasks: UploadTask[]
  activeUploads: number
  addUploadTask: (file: File, bucket: StorageBucket) => Promise<UploadResult>
  clearCompletedTasks: () => void
  clearAllTasks: () => void
}

const ImageUploadContext = React.createContext<ImageUploadContextType | undefined>(undefined)

export function ImageUploadProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<UploadTask[]>([])

  const activeUploads = React.useMemo(
    () => tasks.filter((task) => task.status === 'uploading').length,
    [tasks]
  )

  const addUploadTask = React.useCallback(
    async (file: File, bucket: StorageBucket): Promise<UploadResult> => {
      const taskId = Math.random().toString(36).substr(2, 9)
      
      // Add task to queue
      const newTask: UploadTask = {
        id: taskId,
        file,
        bucket,
        progress: 0,
        status: 'pending'
      }
      
      setTasks((prev) => [...prev, newTask])

      // Start upload
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: 'uploading' } : task
        )
      )

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId && task.status === 'uploading'
                ? { ...task, progress: Math.min(task.progress + 10, 90) }
                : task
            )
          )
        }, 200)

        const result = await uploadFile({ bucket, file })
        
        clearInterval(progressInterval)

        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  progress: 100,
                  status: result.success ? 'success' : 'error',
                  result,
                  error: result.error
                }
              : task
          )
        )

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '업로드 실패'
        
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: 'error',
                  error: errorMessage
                }
              : task
          )
        )

        return {
          success: false,
          error: errorMessage
        }
      }
    },
    []
  )

  const clearCompletedTasks = React.useCallback(() => {
    setTasks((prev) => prev.filter((task) => task.status === 'uploading'))
  }, [])

  const clearAllTasks = React.useCallback(() => {
    setTasks([])
  }, [])

  const value = React.useMemo(
    () => ({
      tasks,
      activeUploads,
      addUploadTask,
      clearCompletedTasks,
      clearAllTasks
    }),
    [tasks, activeUploads, addUploadTask, clearCompletedTasks, clearAllTasks]
  )

  return (
    <ImageUploadContext.Provider value={value}>
      {children}
    </ImageUploadContext.Provider>
  )
}

export function useImageUploadContext() {
  const context = React.useContext(ImageUploadContext)
  if (!context) {
    throw new Error('useImageUploadContext must be used within ImageUploadProvider')
  }
  return context
}