import { useState } from 'react'
import { TASK_COLUMNS } from '../../constants/tasks'
import { BoardColumn } from './BoardColumn'

export function TaskBoard({ tasks, onStatusChange, canChangeStatus, ...actions }) {
  const [draggingId, setDraggingId] = useState(null)
  function moveTask(taskId, status) {
    const task = tasks.find((item) => item.id === taskId)
    if (task && canChangeStatus(task) && task.status !== status) onStatusChange(task, status)
  }
  return <>
    <p className="board-help">Project owners and Admins manage every task. Members can move only assigned tasks. Ordering applies inside each status column.</p>
    <div className="board">{TASK_COLUMNS.map(([status, label]) => <BoardColumn key={status} status={status} label={label} tasks={tasks} draggingId={draggingId} onDragging={setDraggingId} onMoveTask={moveTask} onStatusChange={onStatusChange} canChangeStatus={canChangeStatus} {...actions} />)}</div>
  </>
}
