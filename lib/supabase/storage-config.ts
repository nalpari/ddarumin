export const STORAGE_BUCKETS = {
  MENUS: 'menus',
  STORES: 'stores',
  EVENTS: 'events',
} as const

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]

export const STORAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'] as const,
} as const

export const BUCKET_POLICIES = {
  [STORAGE_BUCKETS.MENUS]: {
    public: true,
    allowedMimeTypes: [...STORAGE_CONFIG.ALLOWED_FILE_TYPES],
    maxFileSize: STORAGE_CONFIG.MAX_FILE_SIZE,
  },
  [STORAGE_BUCKETS.STORES]: {
    public: true,
    allowedMimeTypes: [...STORAGE_CONFIG.ALLOWED_FILE_TYPES],
    maxFileSize: STORAGE_CONFIG.MAX_FILE_SIZE,
  },
  [STORAGE_BUCKETS.EVENTS]: {
    public: true,
    allowedMimeTypes: [...STORAGE_CONFIG.ALLOWED_FILE_TYPES],
    maxFileSize: STORAGE_CONFIG.MAX_FILE_SIZE,
  },
} as const