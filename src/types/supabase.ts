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
      sessions: {
        Row: {
          id: string
          name: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          user_id?: string
        }
      }
      players: {
        Row: {
          id: string
          name: string
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          session_id?: string
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          name: string
          winner_id: string
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          winner_id: string
          session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          winner_id?: string
          session_id?: string
          created_at?: string
        }
      }
    }
  }
}