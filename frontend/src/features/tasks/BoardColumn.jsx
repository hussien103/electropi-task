import { useState } from 'react'
import { TaskCard } from './TaskCard'

export function BoardColumn({ status, label, tasks, draggingId, onDragging, onMoveTask, canChangeStatus, ...actions }) {
  const [dragOver, setDragOver] = useState(false)
  const columnTasks = tasks.filter((task) => task.status === status)
  function drop(event) {
    event.preventDefault(); setDragOver(false)
    const taskId = event.dataTransfer.getData('text/task-id') || draggingId
    if (taskId) onMoveTask(taskId, status)
    onDragging(null)
  }
  return <section className={`column ${dragOver ? 'column-drop-target' : ''}`}
    onDragEnter={(event) => { event.preventDefault(); if (draggingId) setDragOver(true) }}
    onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move' }}
    onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragOver(false) }}
    onDrop={drop}>
    <div className="column-heading"><h2>{label}</h2><span>{columnTasks.length}</span></div>
    <div className="column-tasks">{columnTasks.map((task) => <TaskCard key={task.id} task={task} dragging={draggingId === task.id} canChangeStatus={canChangeStatus(task)}
      onDragStart={(taskId) => onDragging(taskId)} onDragEnd={() => { onDragging(null); setDragOver(false) }} {...actions} />)}</div>
    {draggingId && <div className="drop-hint">Drop here to move to {label}</div>}
  </section>
}
