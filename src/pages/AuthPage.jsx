import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

export default function AuthPage() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error } =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password, displayName)

    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    if (mode === 'signup') {
      setError('')
      navigate('/library', { replace: true })
    } else {
      navigate('/library', { replace: true })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">The Notebook Archive</p>
        <h1 className="auth-title">
          {mode === 'signin' ? 'Welcome back' : 'Open an account'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'signin'
            ? 'Sign in to reach your shelves.'
            : 'Every author gets a library of their own.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <label className="auth-field">
              <span>Display name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How other authors will see you"
                required
              />
            </label>
          )}

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting
              ? 'Please wait…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setError('')
            setMode(mode === 'signin' ? 'signup' : 'signin')
          }}
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
