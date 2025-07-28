'use client'

import * as React from 'react'
import { uploadFile, deleteFile } from '@/lib/supabase/storage'
import { type StorageBucket } from '@/lib/supabase/storage-config'

export interface UseSingleImageOptions {
  bucket: StorageBucket
  path?: string
  initialUrl?: string
  onUploadSuccess?: (url: string) => void
  onUploadError?: (error: Error) => void
  onDeleteSuccess?: () => void
  onDeleteError?: (error: Error) => void
}

export interface UseSingleImageReturn {
  imageUrl: string | null
  isUploading: boolean
  isDeleting: boolean
  error: string | null
  uploadImage: (file: File) => Promise<void>
  deleteImage: () => Promise<void>
  setImageUrl: (url: string | null) => void
  clearError: () => void
}

export function useSingleImage({
  bucket,
  path = '',
  initialUrl,
  onUploadSuccess,
  onUploadError,
  onDeleteSuccess,
  onDeleteError
}: UseSingleImageOptions): UseSingleImageReturn {
  const [imageUrl, setImageUrl] = React.useState<string | null>(initialUrl || null)
  const [imagePath, setImagePath] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const uploadImage = React.useCallback(
    async (file: File) => {
      setIsUploading(true)
      setError(null)

      try {
        // Delete existing image if there is one
        if (imagePath) {
          await deleteFile(bucket, imagePath)
        }

        const result = await uploadFile({ bucket, file, path })

        if (result.success && result.url && result.path) {
          setImageUrl(result.url)
          setImagePath(result.path)
          onUploadSuccess?.(result.url)
        } else {
          throw new Error(result.error || '업로드 실패')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '업로드 중 오류 발생'
        setError(errorMessage)
        onUploadError?.(error instanceof Error ? error : new Error(errorMessage))
      } finally {
        setIsUploading(false)
      }
    },
    [bucket, path, imagePath, onUploadSuccess, onUploadError]
  )

  const deleteImage = React.useCallback(async () => {
    if (!imagePath) return

    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteFile(bucket, imagePath)

      if (result.success) {
        setImageUrl(null)
        setImagePath(null)
        onDeleteSuccess?.()
      } else {
        throw new Error(result.error || '삭제 실패')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '삭제 중 오류 발생'
      setError(errorMessage)
      onDeleteError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsDeleting(false)
    }
  }, [bucket, imagePath, onDeleteSuccess, onDeleteError])

  return {
    imageUrl,
    isUploading,
    isDeleting,
    error,
    uploadImage,
    deleteImage,
    setImageUrl,
    clearError
  }
}