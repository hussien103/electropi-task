import { TASK_COLUMNS } from '../../constants/tasks'

export function TaskCard({ task, onEdit, onDelete, onHistory, onStatusChange, onDragStart, onDragEnd, dragging, canChangeStatus, canManage }) {
  function startDrag(event) {
    if (event.target.closest('button, select, input, a')) { event.preventDefault(); return }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/task-id', task.id)
    onDragStart(task.id)
  }
  return <article className={`task-card surface ${dragging ? 'task-dragging' : ''} ${!canChangeStatus ? 'task-readonly-card' : ''}`} draggable={canChangeStatus} onDragStart={startDrag} onDragEnd={onDragEnd}>
    {canChangeStatus ? <div className="drag-handle" aria-hidden="true">•••</div> : <span className="readonly-badge">VIEW ONLY</span>}
    <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
    <h3>{task.title}</h3><p>{task.description || 'No description'}</p>
    <div className="task-details"><span>{task.assignee?.name || 'Unassigned'}</span><time>{new Date(task.dueDate).toLocaleDateString()}</time></div>
    <div className="task-actions">
      <select value={task.status} disabled={!canChangeStatus} title={canChangeStatus ? 'Change status' : 'Only the assignee, project owner, or an Admin can change status'} onChange={(event) => onStatusChange(task, event.target.value)}>{TASK_COLUMNS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      <button className="quiet" onClick={() => onHistory(task)}>History</button>
      {canManage && <button className="quiet" onClick={() => onEdit(task)}>Edit</button>}
      {canManage && <button className="danger" onClick={() => onDelete(task)}>Delete</button>}
    </div>
  </article>
}
