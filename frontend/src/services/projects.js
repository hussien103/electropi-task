import { api } from '../api'

const root = (projectId) => `/projects/${projectId}`

export const projectService = {
  update: (projectId, data) => api(root(projectId), { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (projectId) => api(root(projectId), { method: 'DELETE' }),
  addMember: (projectId, email) => api(`${root(projectId)}/members`, { method: 'POST', body: JSON.stringify({ email }) }),
  removeMember: (projectId, userId) => api(`${root(projectId)}/members/${userId}`, { method: 'DELETE' }),
}
