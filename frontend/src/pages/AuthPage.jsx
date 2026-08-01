import { Brand } from '../components/common/Brand'
import { AuthForm } from '../features/auth/AuthForm'

export function AuthPage({ mode }) {
  return <main className="auth-shell">
    <section className="auth-intro">
      <Brand />
      <div><span className="kicker">PROJECTS, WITHOUT THE NOISE</span><h1>Work moves better when everyone can see it.</h1><p>A focused project board for teams that value clarity, ownership, and momentum.</p></div>
      <small>Built for productive teams.</small>
    </section>
    <AuthForm mode={mode} />
  </main>
}
