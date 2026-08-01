import { useState } from 'react'
import { Alert } from '../../components/common/Alert'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { Modal } from '../../components/common/Modal'
import { projectService } from '../../services/projects'
import { navigate } from '../../lib/navigation'
import { session } from '../../lib/session'

export function ProjectSettings({ project, members, open, onClose, onChanged }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [removeTarget, setRemoveTarget] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const user = session.user()
  const canManage = project && (project.creatorId === user?.id || user?.role === 'ADMIN')
  if (!canManage) return null
  async function updateProject(event) {
    event.preventDefault(); setError('')
    try { await projectService.update(project.id, Object.fromEntries(new FormData(event.currentTarget))); setMessage('Project details updated.'); await onChanged() }
    catch (reason) { setError(reason.message) }
  }
  async function addMember(event) {
    event.preventDefault(); setError(''); const form = event.currentTarget
    try { await projectService.addMember(project.id, new FormData(form).get('email')); form.reset(); setMessage('Member added to the project.'); await onChanged() }
    catch (reason) { setError(reason.message) }
  }
  async function removeMember() {
    try { await projectService.removeMember(project.id, removeTarget.id); setMessage('Member removed.'); setRemoveTarget(null); await onChanged() }
    catch (reason) { setError(reason.message); setRemoveTarget(null) }
  }
  async function deleteProject() {
    try { await projectService.remove(project.id); navigate('/') } catch (reason) { setError(reason.message); setDeleteOpen(false) }
  }
  return <>
    <Modal open={open} onClose={onClose} eyebrow="OWNER CONTROLS" title="Project settings" description={`Owner: ${project.creator?.name || 'Project owner'}`} size="large">
      <Alert type="success">{message}</Alert><Alert>{error}</Alert>
      <form className="modal-form settings-form" onSubmit={updateProject}>
        <label>Project name<input name="name" required minLength="2" defaultValue={project.name} /></label>
        <label>Description<textarea name="description" maxLength="1000" defaultValue={project.description} /></label>
        <div className="form-actions"><button className="primary">Save changes</button></div>
      </form>
      <section className="member-management"><div><h3>Project members</h3><p>Add an existing registered user by email.</p></div>
        <form className="add-member" onSubmit={addMember}><input name="email" type="email" required placeholder="member@company.com" /><button className="primary">Add member</button></form>
        <div className="member-list">{members.map((member) => <div className="member-row" key={member.id}><span className="avatar">{member.name[0]}</span><span><b>{member.name}</b><small>{member.email}</small></span><span className="member-role">{member.id === project.creatorId ? 'OWNER' : member.role}</span>{member.id !== project.creatorId && <button className="danger" onClick={() => setRemoveTarget(member)}>Remove</button>}</div>)}</div>
      </section>
      <section className="danger-zone"><div><b>Delete project</b><p>Deletes this project, its tasks, audit history, and memberships.</p></div><button className="danger" onClick={() => setDeleteOpen(true)}>Delete project</button></section>
    </Modal>
    <ConfirmDialog open={Boolean(removeTarget)} onClose={() => setRemoveTarget(null)} onConfirm={removeMember} title={`Remove ${removeTarget?.name || 'member'}?`} description="They will immediately lose access to this project and its tasks." confirmLabel="Remove member" danger />
    <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={deleteProject} title={`Delete ${project.name}?`} description="The project, all tasks, status history, and memberships will be permanently deleted." confirmLabel="Delete project" danger />
  </>
}
