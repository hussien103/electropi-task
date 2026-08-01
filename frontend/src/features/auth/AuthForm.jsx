import { useState } from 'react'
import { api } from '../../api'
import { navigate } from '../../lib/navigation'
import { session } from '../../lib/session'
import { Alert } from '../../components/common/Alert'

export function AuthForm({ mode }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const isLogin = mode === 'login'
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const result = await api(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) })
      session.save(result); navigate('/')
    } catch (reason) { setError(reason.message) } finally { setBusy(false) }
  }
  const alternatePath = isLogin ? '/register' : '/login'
  return <form className="auth-card surface" onSubmit={submit}>
    <span className="kicker">{isLogin ? 'WELCOME BACK' : 'JOIN YOUR TEAM'}</span>
    <h2>{isLogin ? 'Sign in to TeamFlow' : 'Create your account'}</h2>
    {!isLogin && <label>Name<input name="name" required minLength="2" placeholder="Your full name" /></label>}
    <label>Email<input name="email" type="email" required placeholder="you@company.com" /></label>
    <label>Password<input name="password" type="password" minLength="8" required placeholder="At least 8 characters" /></label>
    <Alert>{error}</Alert>
    <button className="primary" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}</button>
    <p className="auth-switch">{isLogin ? 'New to TeamFlow? ' : 'Already have an account? '}
      <a href={alternatePath} onClick={(event) => { event.preventDefault(); navigate(alternatePath) }}>{isLogin ? 'Create account' : 'Sign in'}</a>
    </p>
  </form>
}
