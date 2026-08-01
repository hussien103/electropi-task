export function PageHeading({ eyebrow, title, description, actions }) {
  return <div className="page-heading">
    <div><span className="kicker">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {actions}
  </div>
}
