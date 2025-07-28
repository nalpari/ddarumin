'use client'

import * as React from 'react'
import { uploadFile, deleteFile, uploadFiles } from '@/lib/supabase/storage'
import { type StorageBucket } from '@/lib/supabase/storage-config'
import { type FileWithPreview } from '@/components/ui/file-upload'

export interface UploadedImage {
  id: string
  url: string
  path: string
  name: string
  size: number
}

export interface UseImageUploadOptions {
  bucket: StorageBucket
  path?: string
  onUploadSuccess?: (images: UploadedImage[]) => void
  onUploadError?: (error: Error) => void
  onDeleteSuccess?: (id: string) => void
  onDeleteError?: (error: Error) => void
}

export interface UseImageUploadReturn {
  images: UploadedImage[]
  isUploading: boolean
  isDeleting: Record<string, boolean>
  uploadProgress: Record<string, number>
  errors: string[]
  uploadImage: (file: File) => Promise<void>
  uploadImages: (files: File[]) => Promise<void>
  deleteImage: (id: string) => Promise<void>
  clearErrors: () => void
  reset: () => void
}

export function useImageUpload({
  bucket,
  path = '',
  onUploadSuccess,
  onUploadError,
  onDeleteSuccess,
  onDeleteError
}: UseImageUploadOptions): UseImageUploadReturn {
  const [images, setImages] = React.useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState<Record<string, boolean>>({})
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({})
  const [errors, setErrors] = React.useState<string[]>([])

  // Abort controller for cancelling uploads
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const clearErrors = React.useCallback(() => {
    setErrors([])
  }, [])

  const reset = React.useCallback(() => {
    setImages([])
    setIsUploading(false)
    setIsDeleting({})
    setUploadProgress({})
    setErrors([])
    abortControllerRef.current?.abort()
  }, [])

  const uploadImage = React.useCallback(
    async (file: File) => {
      const fileId = Math.random().toString(36).substr(2, 9)
      
      setIsUploading(true)
      setErrors([])
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

      try {
        // Simulate progress (in real app, you'd track actual upload progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + 10, 90)
          }))
        }, 100)

        const result = await uploadFile({ bucket, file, path })

        clearInterval(progressInterval)
        setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }))

        if (result.success && result.url && result.path) {
          const newImage: UploadedImage = {
            id: fileId,
            url: result.url,
            path: result.path,
            name: file.name,
            size: file.size
          }

          setImages((prev) => [...prev, newImage])
          onUploadSuccess?.([newImage])
        } else {
          throw new Error(result.error || '업로드 실패')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '업로드 중 오류 발생'
        setErrors((prev) => [...prev, errorMessage])
        onUploadError?.(error instanceof Error ? error : new Error(errorMessage))
      } finally {
        setIsUploading(false)
        // Clean up progress after a delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const { [fileId]: _, ...rest } = prev
            return rest
          })
        }, 1000)
      }
    },
    [bucket, path, onUploadSuccess, onUploadError]
  )

  const uploadImages = React.useCallback(
    async (files: File[]) => {
      setIsUploading(true)
      setErrors([])

      const uploadedImages: UploadedImage[] = []
      const uploadErrors: string[] = []

      // Create abort controller
      abortControllerRef.current = new AbortController()

      try {
        const results = await uploadFiles(
          bucket,
          files,
          path,
          (progress) => {
            // Update overall progress
            console.log('Upload progress:', progress)
          }
        )

        results.forEach((result, index) => {
          const file = files[index]
          const fileId = Math.random().toString(36).substr(2, 9)

          if (result.success && result.url && result.path) {
            const newImage: UploadedImage = {
              id: fileId,
              url: result.url,
              path: result.path,
              name: file.name,
              size: file.size
            }
            uploadedImages.push(newImage)
          } else {
            uploadErrors.push(`${file.name}: ${result.error || '업로드 실패'}`)
          }
        })

        if (uploadedImages.length > 0) {
          setImages((prev) => [...prev, ...uploadedImages])
          onUploadSuccess?.(uploadedImages)
        }

        if (uploadErrors.length > 0) {
          setErrors(uploadErrors)
          if (uploadErrors.length === files.length) {
            // All files failed
            onUploadError?.(new Error('모든 파일 업로드 실패'))
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '업로드 중 오류 발생'
        setErrors([errorMessage])
        onUploadError?.(error instanceof Error ? error : new Error(errorMessage))
      } finally {
        setIsUploading(false)
        abortControllerRef.current = null
      }
    },
    [bucket, path, onUploadSuccess, onUploadError]
  )

  const deleteImage = React.useCallback(
    async (id: string) => {
      const image = images.find((img) => img.id === id)
      if (!image) return

      setIsDeleting((prev) => ({ ...prev, [id]: true }))
      setErrors([])

      try {
        // Optimistic update
        setImages((prev) => prev.filter((img) => img.id !== id))

        const result = await deleteFile(bucket, image.path)

        if (result.success) {
          onDeleteSuccess?.(id)
        } else {
          // Revert optimistic update on failure
          setImages((prev) => [...prev, image])
          throw new Error(result.error || '삭제 실패')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '삭제 중 오류 발생'
        setErrors((prev) => [...prev, errorMessage])
        onDeleteError?.(error instanceof Error ? error : new Error(errorMessage))
      } finally {
        setIsDeleting((prev) => {
          const { [id]: _, ...rest } = prev
          return rest
        })
      }
    },
    [bucket, images, onDeleteSuccess, onDeleteError]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return {
    images,
    isUploading,
    isDeleting,
    uploadProgress,
    errors,
    uploadImage,
    uploadImages,
    deleteImage,
    clearErrors,
    reset
  }
}