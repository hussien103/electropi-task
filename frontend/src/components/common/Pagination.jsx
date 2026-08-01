export function Pagination({ page, pages, total, onChange }) {
  if (!total) return null
  return <nav className="pagination" aria-label="Pagination">
    <span>{total} result{total === 1 ? '' : 's'} · Page {page} of {Math.max(1, pages)}</span>
    <div><button className="quiet" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button><button className="quiet" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button></div>
  </nav>
}
