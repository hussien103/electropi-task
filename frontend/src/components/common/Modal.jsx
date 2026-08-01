import { useEffect, useId } from 'react'

export function Modal({ open, onClose, eyebrow, title, description, size = 'medium', children, footer }) {
  const titleId = useId()
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', closeOnEscape) }
  }, [open, onClose])
  if (!open) return null
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="modal-header"><div>{eyebrow && <span className="kicker">{eyebrow}</span>}<h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div><button className="modal-close quiet" onClick={onClose} aria-label="Close dialog">×</button></header>
      <div className="modal-body">{children}</div>
      {footer && <footer className="modal-footer">{footer}</footer>}
    </section>
  </div>
}
