import { EmptyState } from '../../components/common/EmptyState'
import { ProjectCard } from './ProjectCard'

export function ProjectGrid({ projects, loading }) {
  if (loading) return <EmptyState>Loading projects...</EmptyState>
  if (!projects.length) return <EmptyState title="No projects found">Create a project or ask an admin to add you.</EmptyState>
  return <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
}
