import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test Supabase connection
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      hasSession: !!data.session,
    })
  } catch (error) {
    console.error('Supabase connection error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}