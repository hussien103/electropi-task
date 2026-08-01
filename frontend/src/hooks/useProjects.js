import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'

export function useProjects(query, page) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 })
  const load = useCallback(async () => {
    setLoading(true)
    try { const result = await api(`/projects?search=${encodeURIComponent(query)}&page=${page}&limit=12`); setProjects(result.items); setMeta({ page: result.page, pages: result.pages, total: result.total }); setError('') }
    catch (reason) { setError(reason.message) }
    finally { setLoading(false) }
  }, [query, page])
  useEffect(() => { const timer = setTimeout(load, 200); return () => clearTimeout(timer) }, [load])
  return { projects, meta, loading, error, setError, reload: load }
}
