import { createClient } from '@supabase/supabase-js';

/**
 * Official Supabase JS SDK Integration for DayFlow / NexaWork
 */

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const isSupabaseConfigured =
  Boolean((import.meta as any).env?.VITE_SUPABASE_URL) &&
  Boolean((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) &&
  !(import.meta as any).env?.VITE_SUPABASE_URL.includes('your-project');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isConfigured: isSupabaseConfigured,
  };
};

/**
 * Helper to query Supabase tables using the official SDK
 */
export async function querySupabaseTable(table: string) {
  if (!isSupabaseConfigured) {
    console.warn('[Supabase] VITE_SUPABASE_URL not configured. Operating in local mock mode.');
    return null;
  }

  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`[Supabase Query Error for ${table}]`, err);
    return null;
  }
}
