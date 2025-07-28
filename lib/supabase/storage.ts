import { createClient } from '@/lib/supabase/client'
import { STORAGE_CONFIG, type StorageBucket } from './storage-config'

export interface UploadFileOptions {
  bucket: StorageBucket
  file: File
  path?: string
  upsert?: boolean
}

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  path?: string
}

function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.')
  const sanitizedName = nameWithoutExtension.replace(/[^a-zA-Z0-9-_]/g, '_')
  
  return `${sanitizedName}_${timestamp}_${randomString}.${extension}`
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `파일 크기가 ${STORAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB를 초과합니다.`
    }
  }

  // Check file type
  if (!STORAGE_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: '허용되지 않은 파일 형식입니다. JPG, PNG, WebP 파일만 업로드 가능합니다.'
    }
  }

  // Check file extension
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
  if (!STORAGE_CONFIG.ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: '허용되지 않은 파일 확장자입니다.'
    }
  }

  return { valid: true }
}

export async function uploadFile({
  bucket,
  file,
  path = '',
  upsert = false
}: UploadFileOptions): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    const supabase = createClient()
    
    // Generate unique file name
    const fileName = generateUniqueFileName(file.name)
    const filePath = path ? `${path}/${fileName}` : fileName

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert,
        cacheControl: '3600',
        contentType: file.type
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Upload exception:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.'
    }
  }
}

export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete exception:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 삭제 중 오류가 발생했습니다.'
    }
  }
}

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Optional: Convert to WebP (client-side conversion)
export async function convertToWebP(file: File): Promise<File | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          resolve(null)
          return
        }

        // Set canvas dimensions
        canvas.width = img.width
        canvas.height = img.height

        // Draw image on canvas
        ctx.drawImage(img, 0, 0)

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '.webp'),
                { type: 'image/webp' }
              )
              resolve(webpFile)
            } else {
              resolve(null)
            }
          },
          'image/webp',
          0.85 // Quality
        )
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}

// Batch upload function
export async function uploadFiles(
  bucket: StorageBucket,
  files: File[],
  path?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  const total = files.length

  for (let i = 0; i < total; i++) {
    const result = await uploadFile({ bucket, file: files[i], path })
    results.push(result)
    
    if (onProgress) {
      onProgress(((i + 1) / total) * 100)
    }
  }

  return results
}