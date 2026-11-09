import { useState } from 'react'

import './LoginSignup.css'

export default function LoginSignup({ onSignUp, onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      if (isSignUp) {
        await onSignUp({ name: email.split('@')[0] || 'User', email, password })
      } else {
        await onSignIn({ email, password })
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <form className="LoginSignup" onSubmit={handleSubmit}>
      <h1>Welcome to the Bare Bones Blog 🦴</h1>
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

      <input type="email" placeholder="Email" value={email} onChange={event => setEmail(event.target.value)} required />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        required
      />

      <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>

      <p>
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <a
              href="#"
              onClick={event => {
                event.preventDefault()
                setIsSignUp(false)
              }}
            >
              Sign in
            </a>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <a
              href="#"
              onClick={event => {
                event.preventDefault()
                setIsSignUp(true)
              }}
            >
              Sign up
            </a>
          </>
        )}
      </p>
    </form>
  )
}
