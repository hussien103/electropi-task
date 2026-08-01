import { api } from '../../api'

export function CreateProjectForm({ onCreated, onError, onCancel }) {
  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    try {
      await api('/projects', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) })
      form.reset(); onCreated()
    } catch (reason) { onError(reason.message) }
  }
  return <form className="modal-form" onSubmit={submit}>
    <label>Project name<input name="name" minLength="2" maxLength="100" required placeholder="e.g. Website redesign" autoFocus /></label>
    <label>Description<textarea name="description" maxLength="1000" placeholder="What will your team accomplish?" /></label>
    <div className="form-actions"><button type="button" className="quiet" onClick={onCancel}>Cancel</button><button className="primary">Create project</button></div>
  </form>
}
