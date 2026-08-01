export function EmptyState({ title, children }) {
  return <div className="empty">{title && <b>{title}</b>}<span>{children}</span></div>
}
