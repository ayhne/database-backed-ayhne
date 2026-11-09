import { useEffect, useState } from 'react'
import { createAuthClient } from '@neondatabase/neon-js/auth'

const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL)
export const getAccessToken = async () => (await authClient.getSession()).data?.session?.token ?? null

/**
 * This is new (and different from the Neon walkthrough): instead of invoking the Neon-specific
 * `authClient` directly from components, we wrap that within its own function, known in React
 * as a “hook.” Hooks are like components that have no JSX, but they can have everything else,
 * and typically return a value that components can then use. That value can have anything,
 * including functions within the hook.
 */
export const useAuthService = () => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [authenticating, setAuthenticating] = useState(true)

  const updateSession = async authResult => {
    if (authResult.error) {
      setAuthenticating(false)
      throw new Error(authResult.error.message)
    }

    const sessionResult = await authClient.getSession()
    if (sessionResult.data?.session && sessionResult.data?.user) {
      setSession(sessionResult.data.session)
      setUser(sessionResult.data.user)
    }
  }

  const signUp = async ({ name, email, password }) => {
    setAuthenticating(true)

    try {
      await updateSession(await authClient.signUp.email({ name, email, password }))
    } finally {
      setAuthenticating(false)
    }
  }

  const signIn = async ({ email, password }) => {
    setAuthenticating(true)

    try {
      await updateSession(await authClient.signIn.email({ email, password }))
    } finally {
      setAuthenticating(false)
    }
  }

  const signOut = async () => {
    await authClient.signOut()
    setSession(null)
    setUser(null)
  }

  // Invoking this hook immediately checks for a current session.
  useEffect(() => {
    authClient.getSession().then(result => {
      if (result.data?.session && result.data?.user) {
        setSession(result.data.session)
        setUser(result.data.user)
      }
      setAuthenticating(false)
    })
  }, [])

  return { session, user, authenticating, signUp, signIn, signOut }
}
