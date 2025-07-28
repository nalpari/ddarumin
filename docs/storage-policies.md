# Supabase Storage Policies

## Storage Buckets

We have three storage buckets configured:
- `menus` - For menu item images
- `stores` - For store images
- `events` - For event banner images

## Bucket Configuration

All buckets are configured with:
- **Public access**: Yes (for reading)
- **Max file size**: 5MB
- **Allowed file types**: jpg, jpeg, png, webp

## RLS Policies

The following RLS policies should be configured in the Supabase dashboard:

### For each bucket (menus, stores, events):

1. **SELECT Policy** (Public Read)
   ```sql
   -- Policy name: Public read access
   -- Target roles: anon, authenticated
   CREATE POLICY "Public read access" ON storage.objects
   FOR SELECT USING (bucket_id = 'bucket_name');
   ```

2. **INSERT Policy** (Authenticated Upload)
   ```sql
   -- Policy name: Authenticated users can upload
   -- Target roles: authenticated
   CREATE POLICY "Authenticated users can upload" ON storage.objects
   FOR INSERT WITH CHECK (
     bucket_id = 'bucket_name' AND
     auth.role() = 'authenticated'
   );
   ```

3. **UPDATE Policy** (Owner Update)
   ```sql
   -- Policy name: Users can update own uploads
   -- Target roles: authenticated
   CREATE POLICY "Users can update own uploads" ON storage.objects
   FOR UPDATE USING (
     bucket_id = 'bucket_name' AND
     auth.uid() = owner
   );
   ```

4. **DELETE Policy** (Owner Delete)
   ```sql
   -- Policy name: Users can delete own uploads
   -- Target roles: authenticated
   CREATE POLICY "Users can delete own uploads" ON storage.objects
   FOR DELETE USING (
     bucket_id = 'bucket_name' AND
     auth.uid() = owner
   );
   ```

## Setup Instructions

1. Run the setup script:
   ```bash
   npm run setup:storage
   ```

2. Go to your Supabase dashboard > Storage > Policies

3. For each bucket, create the policies listed above

## CORS Configuration

CORS is automatically configured for public buckets to allow:
- Origins: Your application domain
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization