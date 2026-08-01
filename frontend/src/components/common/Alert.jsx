export function Alert({ children, type = 'error' }) {
  return children ? <div className={`alert ${type}`} role="alert">{children}</div> : null
}
