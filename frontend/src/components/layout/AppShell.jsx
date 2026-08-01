import { Brand } from '../common/Brand'
import { navigate } from '../../lib/navigation'
import { session } from '../../lib/session'

export function AppShell({ children }) {
  const user = session.user()
  function signOut() { session.clear(); navigate('/login') }
  return <>
    <header className="topbar">
      <Brand />
      <div className="user-menu">
        <span className="avatar">{user?.name?.[0]}</span>
        <span className="identity"><b>{user?.name}</b><small>{user?.role}</small></span>
        <button className="quiet" onClick={signOut}>Sign out</button>
      </div>
    </header>
    {children}
  </>
}
