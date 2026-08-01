import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { api, API_URL } from '../api'
import { session } from '../lib/session'

export function useBoard(projectId, query) {
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 })
  const load = useCallback(async () => {
    try {
      const [projectResult, taskResult, memberResult] = await Promise.all([
        api(`/projects/${projectId}`), api(`/projects/${projectId}/tasks?${query}`), api(`/projects/${projectId}/users`),
      ])
      setProject(projectResult); setTasks(taskResult.items); setMeta({ page: taskResult.page, pages: taskResult.pages, total: taskResult.total }); setMembers(memberResult); setError('')
    } catch (reason) { setError(reason.message) }
  }, [projectId, query])
  useEffect(() => {
    queueMicrotask(load)
    const socket = io(API_URL, { auth: { token: session.token() } })
    socket.emit('project:join', projectId)
    ;['task:created', 'task:updated', 'task:deleted'].forEach((event) => socket.on(event, load))
    return () => socket.disconnect()
  }, [load, projectId])
  return { project, tasks, members, meta, error, setError, reload: load }
}
