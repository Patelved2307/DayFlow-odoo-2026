/**
 * Supabase Client Integration for DayFlow / NexaWork
 */

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const isConfigured =
    Boolean((import.meta as any).env?.VITE_SUPABASE_URL) &&
    Boolean((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) &&
    !(import.meta as any).env?.VITE_SUPABASE_URL.includes('your-project');

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isConfigured,
  };
};

/**
 * Execute raw RPC or fetch query against Supabase REST API
 */
export async function querySupabaseTable(table: string, queryParams: string = '') {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    console.warn('[Supabase] VITE_SUPABASE_URL not configured. Operating in local mock store mode.');
    return null;
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/${table}?${queryParams}`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase REST query failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('[Supabase Query Error]', err);
    return null;
  }
}
