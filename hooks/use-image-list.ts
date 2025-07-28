'use client'

import * as React from 'react'
import { uploadFile, deleteFile } from '@/lib/supabase/storage'
import { type StorageBucket } from '@/lib/supabase/storage-config'
import { extractPathFromUrl } from '@/lib/supabase/storage-utils'

export interface ImageListItem {
  id: string
  url: string
  name?: string
  order?: number
}

export interface UseImageListOptions {
  bucket: StorageBucket
  path?: string
  maxImages?: number
  initialImages?: ImageListItem[]
  onListChange?: (images: ImageListItem[]) => void
}

export interface UseImageListReturn {
  images: ImageListItem[]
  isUploading: boolean
  isDeletingId: string | null
  error: string | null
  addImage: (file: File) => Promise<ImageListItem | null>
  removeImage: (id: string) => Promise<void>
  reorderImages: (fromIndex: number, toIndex: number) => void
  setImages: (images: ImageListItem[]) => void
  clearError: () => void
}

export function useImageList({
  bucket,
  path = '',
  maxImages,
  initialImages = [],
  onListChange
}: UseImageListOptions): UseImageListReturn {
  const [images, setImages] = React.useState<ImageListItem[]>(initialImages)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // Notify parent of changes
  React.useEffect(() => {
    onListChange?.(images)
  }, [images, onListChange])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const addImage = React.useCallback(
    async (file: File): Promise<ImageListItem | null> => {
      if (maxImages && images.length >= maxImages) {
        setError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다`)
        return null
      }

      setIsUploading(true)
      setError(null)

      try {
        const result = await uploadFile({ bucket, file, path })

        if (result.success && result.url) {
          const newImage: ImageListItem = {
            id: Math.random().toString(36).substr(2, 9),
            url: result.url,
            name: file.name,
            order: images.length
          }

          setImages((prev) => [...prev, newImage])
          return newImage
        } else {
          throw new Error(result.error || '업로드 실패')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '업로드 중 오류 발생'
        setError(errorMessage)
        return null
      } finally {
        setIsUploading(false)
      }
    },
    [bucket, path, images.length, maxImages]
  )

  const removeImage = React.useCallback(
    async (id: string) => {
      const image = images.find((img) => img.id === id)
      if (!image) return

      setIsDeletingId(id)
      setError(null)

      try {
        // Extract path from URL
        const imagePath = extractPathFromUrl(image.url, bucket)
        
        if (imagePath) {
          const result = await deleteFile(bucket, imagePath)
          
          if (!result.success) {
            throw new Error(result.error || '삭제 실패')
          }
        }

        // Remove from list
        setImages((prev) => {
          const filtered = prev.filter((img) => img.id !== id)
          // Reorder remaining images
          return filtered.map((img, index) => ({
            ...img,
            order: index
          }))
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '삭제 중 오류 발생'
        setError(errorMessage)
      } finally {
        setIsDeletingId(null)
      }
    },
    [bucket, images]
  )

  const reorderImages = React.useCallback(
    (fromIndex: number, toIndex: number) => {
      setImages((prev) => {
        const newImages = [...prev]
        const [movedImage] = newImages.splice(fromIndex, 1)
        newImages.splice(toIndex, 0, movedImage)
        
        // Update order values
        return newImages.map((img, index) => ({
          ...img,
          order: index
        }))
      })
    },
    []
  )

  return {
    images,
    isUploading,
    isDeletingId,
    error,
    addImage,
    removeImage,
    reorderImages,
    setImages,
    clearError
  }
}