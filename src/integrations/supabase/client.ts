
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://tiaxynkduixekzqzsgvk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYXh5bmtkdWl4ZWt6cXpzZ3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MDQwMjMsImV4cCI6MjA2Mzk4MDAyM30.pLiy2dtIssgVsP-_UnP7nepo1WSui7SqExU0dWctPpY'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
