import { useDeferredValue, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { Alert } from '../components/common/Alert'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { Modal } from '../components/common/Modal'
import { PageHeading } from '../components/common/PageHeading'
import { Pagination } from '../components/common/Pagination'
import { ProjectSettings } from '../features/projects/ProjectSettings'
import { TaskBoard } from '../features/tasks/TaskBoard'
import { TaskAudit } from '../features/tasks/TaskAudit'
import { TaskFilters } from '../features/tasks/TaskFilters'
import { TaskForm } from '../features/tasks/TaskForm'
import { useBoard } from '../hooks/useBoard'
import { navigate } from '../lib/navigation'
import { session } from '../lib/session'
import { taskService } from '../services/tasks'

const emptyFilters = { search: '', status: '', priority: '', assigneeId: '', sort: 'createdAt', order: 'desc' }

export function BoardPage({ projectId }) {
  const [editing, setEditing] = useState(null)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [deleteTask, setDeleteTask] = useState(null)
  const [historyTask, setHistoryTask] = useState(null)
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [success, setSuccess] = useState('')
  const deferredSearch = useDeferredValue(filters.search)
  const query = useMemo(() => new URLSearchParams({ ...filters, search: deferredSearch, page: String(page), limit: '30' }).toString(), [filters, deferredSearch, page])
  const { project, tasks, members, meta, error, setError, reload } = useBoard(projectId, query)
  const currentUser = session.user()
  const canManageProject = project && (project.creatorId === currentUser?.id || currentUser?.role === 'ADMIN')
  const canChangeStatus = (task) => canManageProject || task.assignee?.id === currentUser?.id
  function changeFilters(next) { setFilters(next); setPage(1) }
  function createTask() { setEditing(null); setTaskModalOpen(true) }
  function editTask(task) { setEditing(task); setTaskModalOpen(true) }
  async function save(data) {
    if (editing) { await taskService.update(projectId, editing.id, data); setSuccess('Task updated successfully.') }
    else { await taskService.create(projectId, data); setSuccess('Task created successfully.') }
    setTaskModalOpen(false); setEditing(null); await reload()
  }
  async function updateStatus(task, status) {
    try { await taskService.update(projectId, task.id, { status }); setSuccess(`“${task.title}” moved successfully.`); await reload() }
    catch (reason) { setError(reason.message) }
  }
  async function confirmTaskDelete() {
    try { await taskService.remove(projectId, deleteTask.id); setSuccess('Task deleted.'); setDeleteTask(null); await reload() }
    catch (reason) { setError(reason.message); setDeleteTask(null) }
  }
  return <AppShell><main className="page board-page">
    <button className="back quiet" onClick={() => navigate('/')}>← All projects</button>
    <PageHeading eyebrow="PROJECT BOARD" title={project?.name || 'Loading...'} description={project?.description}
      actions={<div className="heading-actions">{canManageProject && <button className="quiet" onClick={() => setSettingsOpen(true)}>Project settings</button>}{canManageProject && <button className="primary" onClick={createTask}>+ New task</button>}</div>} />
    <Alert type="success">{success}</Alert><Alert>{error}</Alert>
    <TaskFilters filters={filters} members={members} onChange={changeFilters} />
    <TaskBoard tasks={tasks} onEdit={editTask} onDelete={setDeleteTask} onHistory={setHistoryTask} onStatusChange={updateStatus} canChangeStatus={canChangeStatus} canManage={canManageProject} />
    <Pagination {...meta} onChange={setPage} />
    <Modal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} eyebrow={editing ? 'EDIT TASK' : 'NEW TASK'} title={editing ? 'Update task' : 'Create a task'} description={editing ? 'Adjust the details, ownership, or deadline.' : 'Add a clear, actionable item to this project.'}>
      <TaskForm key={editing?.id || 'new'} members={members} task={editing} onSaved={save} onCancel={() => setTaskModalOpen(false)} />
    </Modal>
    {project && <ProjectSettings project={project} members={members} open={settingsOpen} onClose={() => setSettingsOpen(false)} onChanged={reload} />}
    <ConfirmDialog open={Boolean(deleteTask)} onClose={() => setDeleteTask(null)} onConfirm={confirmTaskDelete} title={`Delete ${deleteTask?.title || 'task'}?`} description="The task and its status history will be permanently deleted." confirmLabel="Delete task" danger />
    <Modal open={Boolean(historyTask)} onClose={() => setHistoryTask(null)} eyebrow="AUDIT LOG" title={historyTask?.title || 'Task history'} description="Every recorded status transition, including who made it and when.">{historyTask && <TaskAudit projectId={projectId} task={historyTask} />}</Modal>
  </main></AppShell>
}
