'use client'

import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileImage, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { STORAGE_CONFIG } from '@/lib/supabase/storage-config'
import { formatFileSize, createImagePreview } from '@/lib/supabase/storage-utils'
import { validateFile } from '@/lib/supabase/storage'

export interface FileWithPreview extends File {
  preview?: string
  id?: string
}

export interface FileUploadProps {
  value?: FileWithPreview[]
  onChange?: (files: FileWithPreview[]) => void
  onUpload?: (files: FileWithPreview[]) => Promise<void>
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  accept?: Record<string, string[]>
  className?: string
  showPreview?: boolean
  uploadProgress?: Record<string, number>
}

export function FileUpload({
  value = [],
  onChange,
  onUpload,
  maxFiles = 10,
  multiple = true,
  disabled = false,
  accept = {
    'image/*': STORAGE_CONFIG.ALLOWED_EXTENSIONS
  },
  className,
  showPreview = true,
  uploadProgress = {}
}: FileUploadProps) {
  const [files, setFiles] = React.useState<FileWithPreview[]>(value)
  const [errors, setErrors] = React.useState<string[]>([])
  const [isUploading, setIsUploading] = React.useState(false)

  // Update files when value prop changes
  React.useEffect(() => {
    setFiles(value)
  }, [value])

  const onDrop = React.useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      setErrors([])
      const newErrors: string[] = []

      // Handle rejected files
      rejectedFiles.forEach((rejection) => {
        rejection.errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            newErrors.push(`${rejection.file.name}: 파일 크기가 너무 큽니다`)
          } else if (error.code === 'file-invalid-type') {
            newErrors.push(`${rejection.file.name}: 허용되지 않은 파일 형식입니다`)
          } else {
            newErrors.push(`${rejection.file.name}: ${error.message}`)
          }
        })
      })

      // Validate accepted files
      const validFiles: FileWithPreview[] = []
      for (const file of acceptedFiles) {
        const validation = validateFile(file)
        if (!validation.valid) {
          newErrors.push(`${file.name}: ${validation.error}`)
        } else {
          // Create preview for valid files
          const fileWithPreview = Object.assign(file, {
            preview: await createImagePreview(file),
            id: Math.random().toString(36).substr(2, 9)
          }) as FileWithPreview
          validFiles.push(fileWithPreview)
        }
      }

      // Check max files limit
      const totalFiles = files.length + validFiles.length
      if (maxFiles && totalFiles > maxFiles) {
        newErrors.push(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다`)
        validFiles.splice(maxFiles - files.length)
      }

      setErrors(newErrors)

      // Update files
      const updatedFiles = [...files, ...validFiles]
      setFiles(updatedFiles)
      onChange?.(updatedFiles)
    },
    [files, onChange, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled: disabled || isUploading,
    maxSize: STORAGE_CONFIG.MAX_FILE_SIZE
  })

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    onChange?.(updatedFiles)
  }

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return

    setIsUploading(true)
    setErrors([])

    try {
      await onUpload(files)
      // Clear files after successful upload
      setFiles([])
      onChange?.([])
    } catch (error) {
      setErrors([error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다'])
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative overflow-hidden rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-sky-500 bg-sky-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? '여기에 파일을 놓으세요'
            : '파일을 드래그하거나 클릭하여 선택하세요'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {STORAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')} (최대{' '}
          {STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)
        </p>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 p-3">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* File preview */}
      {showPreview && files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-16 w-16 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100">
                  <FileImage className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                {uploadProgress[file.id!] !== undefined && (
                  <Progress
                    value={uploadProgress[file.id!]}
                    className="mt-1 h-1"
                  />
                )}
              </div>
              {!isUploading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id!)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {onUpload && files.length > 0 && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              업로드 중...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {files.length}개 파일 업로드
            </>
          )}
        </Button>
      )}
    </div>
  )
}