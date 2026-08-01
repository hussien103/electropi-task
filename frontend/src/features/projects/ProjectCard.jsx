import { navigate } from '../../lib/navigation'

export function ProjectCard({ project }) {
  const path = `/projects/${project.id}`
  return <a className="project-card surface" href={path} onClick={(event) => { event.preventDefault(); navigate(path) }}>
    <span className="project-icon">{project.name[0]}</span>
    <h3>{project.name}</h3><p>{project.description || 'No description added.'}</p>
    <div className="stats"><span>{project._count?.tasks || 0} tasks</span><span>{project._count?.members || 0} members</span></div>
  </a>
}
