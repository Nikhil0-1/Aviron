import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export let supabase: SupabaseClient | null = null;
export let isSupabaseConfigured = false;

if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-supabase-project')) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    isSupabaseConfigured = true;
    console.log('⚡ Supabase PostgreSQL Database client initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Could not initialize Supabase client:', error);
  }
} else {
  console.log('ℹ️ Supabase credentials not set. Falling back to local demo DB provider.');
}
