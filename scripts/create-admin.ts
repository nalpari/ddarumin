import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Create Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role key for admin operations
)

async function createAdmin() {
  const email = 'admin@example.com'
  const password = 'admin123' // Change this in production
  const name = '관리자'

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    console.log('Created auth user:', authData.user.email)

    // Hash password for database storage
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin record in database
    const admin = await prisma.admin.create({
      data: {
        username: email,
        password: hashedPassword,
        name,
        status: 'ACTIVE'
      }
    })

    console.log('Created admin:', admin)
    console.log('\nLogin credentials:')
    console.log('Email:', email)
    console.log('Password:', password)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()