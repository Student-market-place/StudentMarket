import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://shyueiubgibnztmjcbqs.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeXVlaXViZ2libnp0bWpjYnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNzg0ODgsImV4cCI6MjA1NjY1NDQ4OH0.OPuomNmo_bhxRBPjGMZqsMUkSOyG-m6QZC4LbBYE8g8"

if (!supabaseUrl || !supabaseKey) {
    
  throw new Error(`Missing Supabase environment variables ${supabaseUrl} ${supabaseKey}`)
}

export const supabase = createClient(supabaseUrl, supabaseKey) 