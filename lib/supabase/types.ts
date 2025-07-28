export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          username: string
          password: string
          name: string
          status: 'ACTIVE' | 'INACTIVE'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          name: string
          status?: 'ACTIVE' | 'INACTIVE'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          name?: string
          status?: 'ACTIVE' | 'INACTIVE'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}