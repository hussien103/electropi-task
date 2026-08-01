import { AuthPage } from './pages/AuthPage'
import { BoardPage } from './pages/BoardPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { usePath } from './hooks/usePath'
import { projectIdFromPath } from './lib/navigation'
import { session } from './lib/session'
import './App.css'

export default function App() {
  const path = usePath()
  const authenticated = Boolean(session.token())
  if (!authenticated) return <AuthPage mode={path === '/register' ? 'register' : 'login'} />
  if (path === '/login' || path === '/register') return <ProjectsPage />
  const projectId = projectIdFromPath(path)
  return projectId ? <BoardPage projectId={projectId} /> : <ProjectsPage />
}
