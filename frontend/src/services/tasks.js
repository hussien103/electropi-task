import { api } from '../api'

const root = (projectId) => `/projects/${projectId}/tasks`

export const taskService = {
  create: (projectId, data) => api(root(projectId), { method: 'POST', body: JSON.stringify(data) }),
  update: (projectId, taskId, data) => api(`${root(projectId)}/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (projectId, taskId) => api(`${root(projectId)}/${taskId}`, { method: 'DELETE' }),
  audit: (projectId, taskId) => api(`${root(projectId)}/${taskId}/audit`),
}
