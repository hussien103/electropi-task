import { useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { Alert } from '../components/common/Alert'
import { Modal } from '../components/common/Modal'
import { PageHeading } from '../components/common/PageHeading'
import { Pagination } from '../components/common/Pagination'
import { CreateProjectForm } from '../features/projects/CreateProjectForm'
import { ProjectGrid } from '../features/projects/ProjectGrid'
import { useProjects } from '../hooks/useProjects'

export function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [success, setSuccess] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const { projects, meta, loading, error, setError, reload } = useProjects(query, page)
  function created() { setCreateOpen(false); setSuccess('Project created successfully.'); reload() }
  return <AppShell><main className="page">
    <PageHeading eyebrow="YOUR WORKSPACE" title="Projects" description="Everything your team is moving forward."
      actions={<div className="heading-actions"><input className="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search projects..." aria-label="Search projects" /><button className="primary" onClick={() => setCreateOpen(true)}>+ New project</button></div>} />
    <Alert type="success">{success}</Alert><Alert>{error}</Alert>
    <ProjectGrid projects={projects} loading={loading} />
    <Pagination {...meta} onChange={setPage} />
    <Modal open={createOpen} onClose={() => setCreateOpen(false)} eyebrow="NEW PROJECT" title="Create a project" description="Give your team a clear place to organize the work.">
      <CreateProjectForm onCreated={created} onError={setError} onCancel={() => setCreateOpen(false)} />
    </Modal>
  </main></AppShell>
}
