export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function api(path, options = {}) {
  const token = localStorage.getItem('token')
  let response
  try { response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }) } catch { throw new Error('Cannot reach the API. Check that the backend is running and refresh the page.') }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const fieldErrors = body.errors?.fieldErrors
    const details = fieldErrors && Object.entries(fieldErrors).flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))
    throw new Error(details?.length ? details.join('. ') : body.message || `Request failed (${response.status})`)
  }
  return response.status === 204 ? undefined : response.json()
}
