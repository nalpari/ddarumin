import { uploadFile, deleteFile, getPublicUrl, validateFile } from '../storage'
import { STORAGE_BUCKETS } from '../storage-config'

// Mock file for testing
function createMockFile(name: string, size: number, type: string): File {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

describe('Storage Utilities', () => {
  describe('validateFile', () => {
    it('should accept valid image files', () => {
      const validFile = createMockFile('test.jpg', 1024 * 1024, 'image/jpeg')
      const result = validateFile(validFile)
      expect(result.valid).toBe(true)
    })

    it('should reject files that are too large', () => {
      const largeFile = createMockFile('test.jpg', 10 * 1024 * 1024, 'image/jpeg')
      const result = validateFile(largeFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('5MB')
    })

    it('should reject non-image files', () => {
      const textFile = createMockFile('test.txt', 1024, 'text/plain')
      const result = validateFile(textFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('허용되지 않은 파일 형식')
    })

    it('should accept all allowed image types', () => {
      const imageTypes = [
        { name: 'test.jpg', type: 'image/jpeg' },
        { name: 'test.png', type: 'image/png' },
        { name: 'test.webp', type: 'image/webp' }
      ]

      imageTypes.forEach(({ name, type }) => {
        const file = createMockFile(name, 1024, type)
        const result = validateFile(file)
        expect(result.valid).toBe(true)
      })
    })
  })

  describe('generateUniqueFileName', () => {
    it('should generate unique file names', () => {
      // This would need to be exported from storage.ts to test directly
      // For now, we can test indirectly through uploadFile
    })
  })

  describe('URL utilities', () => {
    it('should generate public URLs correctly', () => {
      const bucket = STORAGE_BUCKETS.MENUS
      const path = 'test/image.jpg'
      const url = getPublicUrl(bucket, path)
      
      expect(url).toContain(bucket)
      expect(url).toContain(path)
    })
  })
})