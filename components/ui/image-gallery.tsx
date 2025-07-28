'use client'

import * as React from 'react'
import { X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface ImageGalleryItem {
  id: string
  url: string
  name?: string
  size?: number
}

export interface ImageGalleryProps {
  images: ImageGalleryItem[]
  onRemove?: (id: string) => void
  isLoading?: boolean
  className?: string
  columns?: 2 | 3 | 4
}

export function ImageGallery({
  images,
  onRemove,
  isLoading = false,
  className,
  columns = 3
}: ImageGalleryProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">업로드된 이미지가 없습니다</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        `grid gap-4 ${gridCols[columns]}`,
        className
      )}
    >
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative overflow-hidden rounded-lg border bg-gray-50"
        >
          <img
            src={image.url}
            alt={image.name || 'Image'}
            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
          />
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => onRemove(image.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {image.name && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="truncate text-sm text-white">{image.name}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}