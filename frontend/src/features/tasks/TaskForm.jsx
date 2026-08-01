import { useState } from 'react'
import { PRIORITIES } from '../../constants/tasks'
import { Alert } from '../../components/common/Alert'

export function TaskForm({ members, task, onSaved, onCancel }) {
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault(); const form = event.currentTarget; const raw = Object.fromEntries(new FormData(form))
    try { await onSaved({ ...raw, assigneeId: raw.assigneeId || null, dueDate: new Date(raw.dueDate).toISOString() }); form.reset() }
    catch (reason) { setError(reason.message) }
  }
  return <form className="modal-form" onSubmit={submit}>
    <label>Task title<input name="title" required minLength="2" maxLength="150" placeholder="What needs to be done?" defaultValue={task?.title} autoFocus /></label>
    <label>Description<textarea name="description" maxLength="3000" placeholder="Add useful context" defaultValue={task?.description} /></label>
    <div className="form-grid"><label>Priority<select name="priority" defaultValue={task?.priority || 'MEDIUM'}>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
      <label>Assignee<select name="assigneeId" defaultValue={task?.assigneeId || ''}><option value="">Unassigned</option>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
      <label>Due date<input type="date" name="dueDate" required defaultValue={task?.dueDate?.slice(0, 10)} /></label></div>
    <Alert>{error}</Alert>
    <div className="form-actions"><button type="button" className="quiet" onClick={onCancel}>Cancel</button><button className="primary">{task ? 'Save changes' : 'Create task'}</button></div>
  </form>
}
