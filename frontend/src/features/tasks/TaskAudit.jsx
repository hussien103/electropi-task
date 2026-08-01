import { useEffect, useState } from 'react'
import { Alert } from '../../components/common/Alert'
import { taskService } from '../../services/tasks'
const labels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }
export function TaskAudit({ projectId, task }) {
  const [items, setItems] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState('')
  useEffect(() => { let active = true; taskService.audit(projectId, task.id).then((result) => active && setItems(result)).catch((reason) => active && setError(reason.message)).finally(() => active && setLoading(false)); return () => { active = false } }, [projectId, task.id])
  if (loading) return <p className="empty-state">Loading history…</p>
  return <div><Alert>{error}</Alert>{!error && !items.length && <p className="empty-state">No status changes yet.</p>}<ol className="audit-list">{items.map((item) => <li key={item.id}><span className="audit-dot"/><div><b>{labels[item.fromStatus]} → {labels[item.toStatus]}</b><p>Changed by {item.user.name} · {new Date(item.createdAt).toLocaleString()}</p></div></li>)}</ol></div>
}
