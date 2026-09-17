import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export let supabaseClient: SupabaseClient | null = null;
export let isSupabaseWebConfigured = false;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-project')) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseWebConfigured = true;
    console.log('⚡ Supabase Web JS Client initialized.');
  } catch (error) {
    console.warn('⚠️ Could not initialize Supabase Web Client:', error);
  }
} else {
  console.log('ℹ️ Supabase Web URL not set. Demo database provider active.');
}
