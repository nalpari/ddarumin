# File Upload Integration Guide

## Overview

This guide explains how to integrate the file upload system into admin forms and pages.

## Components

### 1. SingleFileUpload
For single image uploads (e.g., menu item image, event banner)

```tsx
import { SingleFileUpload } from '@/components/ui/single-file-upload'
import { uploadFile } from '@/lib/supabase/storage'
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config'

// In your form component
const handleImageUpload = async (file: File): Promise<string> => {
  const result = await uploadFile({
    bucket: STORAGE_BUCKETS.MENUS,
    file,
    path: `menu-items/${new Date().getFullYear()}`,
  })
  
  if (result.success && result.url) {
    return result.url
  }
  throw new Error(result.error || 'Upload failed')
}

// In your form
<SingleFileUpload
  value={imageUrl}
  onChange={setImageUrl}
  onUpload={handleImageUpload}
/>
```

### 2. FileUpload
For multiple file uploads (e.g., store images)

```tsx
import { FileUpload } from '@/components/ui/file-upload'

<FileUpload
  value={files}
  onChange={setFiles}
  onUpload={handleMultipleUpload}
  maxFiles={5}
  multiple
/>
```

### 3. ImageGallery
For displaying uploaded images with delete functionality

```tsx
import { ImageGallery } from '@/components/ui/image-gallery'

<ImageGallery
  images={images}
  onRemove={handleRemove}
  columns={3}
/>
```

## Hooks

### useImageUpload
For complex multi-image upload scenarios

```tsx
const {
  images,
  isUploading,
  uploadImage,
  deleteImage,
  errors
} = useImageUpload({
  bucket: STORAGE_BUCKETS.STORES,
  path: 'stores/2024',
  onUploadSuccess: (images) => console.log('Uploaded:', images),
})
```

### useSingleImage
For simple single image management

```tsx
const {
  imageUrl,
  isUploading,
  uploadImage,
  deleteImage,
  error
} = useSingleImage({
  bucket: STORAGE_BUCKETS.EVENTS,
  initialUrl: existingImageUrl,
})
```

### useImageList
For managing ordered image collections

```tsx
const {
  images,
  addImage,
  removeImage,
  reorderImages
} = useImageList({
  bucket: STORAGE_BUCKETS.STORES,
  maxImages: 5,
  initialImages: existingImages,
})
```

## Integration Examples

### Menu Form Integration
See `/components/admin/forms/menu-form.tsx` for a complete example of:
- Single image upload
- Form validation with zod
- Error handling
- Loading states

### Store Form Integration
See `/components/admin/forms/store-form.tsx` for:
- Multiple image upload
- Image gallery display
- Maximum file limits
- Image removal

### Event Form Integration
See `/components/admin/forms/event-form.tsx` for:
- Required image upload
- Date validation
- Conditional fields

## Best Practices

1. **Always validate files** before upload
   - Check file size (max 5MB)
   - Verify file type (jpg, png, webp)

2. **Use appropriate storage buckets**
   - `STORAGE_BUCKETS.MENUS` for menu images
   - `STORAGE_BUCKETS.STORES` for store images
   - `STORAGE_BUCKETS.EVENTS` for event banners

3. **Organize files by path**
   - Use year-based folders: `menu-items/2024/`
   - Or category-based: `stores/seoul/`

4. **Handle errors gracefully**
   - Show toast notifications
   - Display inline error messages
   - Provide retry options

5. **Optimize images**
   - Use lazy loading for galleries
   - Generate thumbnails for lists
   - Consider WebP conversion

## Database Storage

Store only the URL in the database:

```sql
-- Example: Menu table
CREATE TABLE Menu (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  imageUrl TEXT,
  -- other fields...
);
```

## Security Notes

1. **Authentication Required**: All upload operations require authentication
2. **File Validation**: Files are validated on both client and server
3. **Storage Policies**: Buckets have RLS policies for access control
4. **URL Security**: Generated URLs are public but unique

## Troubleshooting

### Common Issues

1. **Upload fails with "Unauthorized"**
   - Ensure user is authenticated
   - Check Supabase Storage policies

2. **File size error**
   - Maximum file size is 5MB
   - Consider image compression

3. **Invalid file type**
   - Only jpg, jpeg, png, webp allowed
   - Check file extension and MIME type

4. **CORS errors**
   - Verify Supabase project URL
   - Check bucket CORS settings