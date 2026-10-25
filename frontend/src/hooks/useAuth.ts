import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export interface AuthState {
  session: any
  user: any
  loading: boolean
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
  })

  useEffect(() => {
    // Restore session on mount
    supabase.auth
      .getSession()
      .then(({ data, error }: any) => {
        if (error) {
          console.error('Error fetching Supabase session:', error)
          setAuth({ session: null, user: null, loading: false })
          return
        }
        const session = data?.session ?? null
        setAuth({ session, user: session?.user ?? null, loading: false })
      })
      .catch((err: any) => {
        console.error('Failed to get session:', err)
        setAuth({ session: null, user: null, loading: false })
      })

    // Listen for session changes (handles initial sign in, OAuth redirects, sign out, token refresh)
    const { data } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        setAuth({ session: session ?? null, user: session?.user ?? null, loading: false })
      }
    )

    return () => {
      data?.subscription?.unsubscribe()
    }
  }, [])

  return auth
}