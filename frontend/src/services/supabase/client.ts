/**
 * Verba Supabase Client
 * Configured via Vite environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
 * Never expose a service-role key to the browser.
 *
 * Usage:
 *   import { supabase } from '@/services/supabase'
 *   const { data, error } = await supabase.from('books').select('*')
 *
 * In tests or offline environments where credentials are unavailable,
 * this module will gracefully degrade: supabase will be a fallback client
 * whose data methods return safe defaults and auth methods report actionable configuration errors.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const rawUrl = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : undefined
const rawAnonKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : undefined

const trimmedUrl = typeof rawUrl === 'string' ? rawUrl.trim() : undefined
// Normalize Supabase URL: strip trailing slash and accidental /rest/v1 suffix
const url = trimmedUrl ? trimmedUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '') : undefined
const anonKey = typeof rawAnonKey === 'string' ? rawAnonKey.trim() : undefined

export const isSupabaseConfigured = Boolean(
  url &&
  anonKey &&
  url.startsWith('http') &&
  !url.includes('your_supabase_project_url') &&
  !anonKey.includes('your_supabase_anon_key')
)

let clientInstance: SupabaseClient | any = null

if (isSupabaseConfigured && url && anonKey) {
  try {
    clientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
  }
}

// Safe temporary diagnostics (never prints key value)
export const getSupabaseDiagnostics = () => ({
  normalizedUrl: url,
  hasApiKey: Boolean(anonKey),
  keyPrefix: anonKey ? anonKey.slice(0, 15) + '...' : 'none',
  isConfigured: isSupabaseConfigured,
  supabaseUrl: clientInstance?.supabaseUrl,
  authUrl: clientInstance?.auth?.url,
})

if (typeof window !== 'undefined') {
  console.log('[Verba Supabase Diagnostics]', getSupabaseDiagnostics())
}

// Fallback client for environments without credentials
// Data methods return safe empty defaults; auth methods return actionable errors (never silent success).
if (!clientInstance) {
  const missingConfigError = {
    name: 'AuthConfigurationError',
    message: 'Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env',
    status: 400,
  }

  clientInstance = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      upsert: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
      on: () => ({ data: null }),
      off: () => {},
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: { provider: 'google', url: null }, error: missingConfigError }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
      },
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: { provider: 'google', url: null }, error: missingConfigError }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
    },
  }
}

export const supabase = clientInstance