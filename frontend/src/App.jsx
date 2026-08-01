import { AuthPage } from './pages/AuthPage'
import { BoardPage } from './pages/BoardPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { usePath } from './hooks/usePath'
import { navigate, projectIdFromPath } from './lib/navigation'
import { session } from './lib/session'
import './App.css'

export default function App() {
  const path = usePath()
  const authenticated = Boolean(session.token())
  if (path === '/login' || path === '/register') return authenticated ? <ProjectsPage /> : <AuthPage mode={path.slice(1)} />
  if (!authenticated) { setTimeout(() => navigate('/login'), 0); return null }
  const projectId = projectIdFromPath(path)
  return projectId ? <BoardPage projectId={projectId} /> : <ProjectsPage />
}
