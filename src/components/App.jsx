import './App.css'

import { useAuthService } from '../services/authService'

import Blog from './Blog'
import LoginSignup from './LoginSignup'

export default function App() {
  const { session, user, authenticating, signUp, signIn, signOut } = useAuthService()

  if (authenticating) {
    return <section className="App-loading">Loading...</section>
  }

  return session && user ? <Blog onSignOut={signOut} /> : <LoginSignup onSignUp={signUp} onSignIn={signIn} />
}
