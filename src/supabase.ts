import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    // Debug output while we hunt the dying channel — remove once it holds.
    // Cursor traffic is left out, only the interesting frames are printed.
    logger: (kind: string, message: string, data?: unknown) => {
      if (JSON.stringify(data ?? '').includes('cursor')) return
      console.log('realtime:', kind, message, data)
    },
  },
})

/** Asks the Supabase project whether it answers at all. */
export async function isSupabaseReachable(): Promise<boolean> {
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabaseAnonKey },
    })
    return response.ok
  } catch {
    return false
  }
}
