'use client'

import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { STORAGE_CONFIG } from '@/lib/supabase/storage-config'
import { formatFileSize, createImagePreview } from '@/lib/supabase/storage-utils'
import { validateFile } from '@/lib/supabase/storage'

export interface SingleFileUploadProps {
  value?: string // URL of the uploaded file
  onChange?: (url: string | undefined) => void
  onUpload?: (file: File) => Promise<string> // Returns uploaded URL
  disabled?: boolean
  accept?: Record<string, string[]>
  className?: string
  placeholder?: string
}

export function SingleFileUpload({
  value,
  onChange,
  onUpload,
  disabled = false,
  accept = {
    'image/*': STORAGE_CONFIG.ALLOWED_EXTENSIONS
  },
  className,
  placeholder = '이미지를 업로드하세요'
}: SingleFileUploadProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const [error, setError] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  // Update preview when value changes
  React.useEffect(() => {
    if (value && !file) {
      setPreview(value)
    }
  }, [value, file])

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      const validation = validateFile(file)

      if (!validation.valid) {
        setError(validation.error || '파일 검증 실패')
        return
      }

      setFile(file)
      const preview = await createImagePreview(file)
      setPreview(preview)

      // Auto upload if onUpload is provided
      if (onUpload) {
        setIsUploading(true)
        try {
          const url = await onUpload(file)
          onChange?.(url)
          setFile(null) // Clear file after successful upload
        } catch (error) {
          setError(error instanceof Error ? error.message : '업로드 실패')
          setPreview(null)
          setFile(null)
        } finally {
          setIsUploading(false)
        }
      }
    },
    [onUpload, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled: disabled || isUploading,
    maxSize: STORAGE_CONFIG.MAX_FILE_SIZE
  })

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    onChange?.(undefined)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            'relative overflow-hidden rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
            isDragActive
              ? 'border-sky-500 bg-sky-50'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-400" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <p className="mt-2 text-sm text-gray-600">
            {isUploading
              ? '업로드 중...'
              : isDragActive
              ? '여기에 파일을 놓으세요'
              : placeholder}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {STORAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')} (최대{' '}
            {STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full rounded-lg object-cover"
          />
          {!disabled && !isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {file && (
            <div className="mt-2 text-sm text-gray-600">
              {file.name} ({formatFileSize(file.size)})
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}