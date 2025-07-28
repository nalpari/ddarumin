import { createClient } from '@supabase/supabase-js'
import { STORAGE_BUCKETS, BUCKET_POLICIES } from '../lib/supabase/storage-config'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function setupStorageBuckets() {
  console.log('Setting up Supabase Storage buckets...')

  for (const [bucketName, policy] of Object.entries(BUCKET_POLICIES)) {
    try {
      // Check if bucket exists
      const { data: existingBucket, error: checkError } = await supabase
        .storage
        .getBucket(bucketName)

      if (checkError && checkError.message.includes('not found')) {
        // Create bucket
        const { data, error: createError } = await supabase
          .storage
          .createBucket(bucketName, {
            public: policy.public,
            allowedMimeTypes: policy.allowedMimeTypes,
            fileSizeLimit: policy.maxFileSize,
          })

        if (createError) {
          console.error(`Error creating bucket ${bucketName}:`, createError)
        } else {
          console.log(`✅ Created bucket: ${bucketName}`)
        }
      } else if (existingBucket) {
        console.log(`ℹ️  Bucket already exists: ${bucketName}`)
        
        // Update bucket configuration
        const { error: updateError } = await supabase
          .storage
          .updateBucket(bucketName, {
            public: policy.public,
            allowedMimeTypes: policy.allowedMimeTypes,
            fileSizeLimit: policy.maxFileSize,
          })

        if (updateError) {
          console.error(`Error updating bucket ${bucketName}:`, updateError)
        } else {
          console.log(`✅ Updated bucket configuration: ${bucketName}`)
        }
      }
    } catch (error) {
      console.error(`Error processing bucket ${bucketName}:`, error)
    }
  }

  console.log('\nStorage bucket setup completed!')
  console.log('\nNote: RLS policies should be configured in the Supabase dashboard:')
  console.log('1. Go to Storage > Policies')
  console.log('2. For each bucket, create policies for:')
  console.log('   - SELECT: Allow public access (for public buckets)')
  console.log('   - INSERT: Require authentication')
  console.log('   - UPDATE: Require authentication')
  console.log('   - DELETE: Require authentication')
}

setupStorageBuckets()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Setup failed:', error)
    process.exit(1)
  })