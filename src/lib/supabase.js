import { createClient } from '@supabase/supabase-js';

// Default Supabase project configuration with fallback credentials to prevent blank screen crashes on Vercel
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://nggbfdsdpotszdhfldqk.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZ2JmZHNkcG90c3pkaGZsZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTU5MTgsImV4cCI6MjEwMTU3MTkxOH0.H5UMmLyGaTzUtO6vdb5Hp_2tnPIJuNMFKZ_PJQH4GNE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
