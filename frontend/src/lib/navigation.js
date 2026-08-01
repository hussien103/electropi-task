export function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function projectIdFromPath(path) {
  return path.match(/^\/projects\/([^/]+)$/)?.[1] ?? null
}
