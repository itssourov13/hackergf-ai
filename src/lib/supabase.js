import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://iausxfvlhqtlcoaovoiv.supabase.co"

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdXN4ZnZsaHF0bGNvYW92b2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDIzNjYsImV4cCI6MjEwMDExODM2Nn0.GF9N-dIbyYgScR1JdPtKe35pENRZo42d7G8DLupKxyo"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
