import { PRIORITIES, TASK_COLUMNS } from '../../constants/tasks'

export function TaskFilters({ filters, members, onChange }) {
  const set = (field) => (event) => onChange({ ...filters, [field]: event.target.value })
  const setSort = (event) => { const [sort, order] = event.target.value.split(':'); onChange({ ...filters, sort, order }) }
  return <div className="task-filters surface">
    <input value={filters.search} onChange={set('search')} placeholder="Search tasks..." aria-label="Search tasks" />
    <select value={filters.status} onChange={set('status')} aria-label="Filter by status"><option value="">All statuses</option>{TASK_COLUMNS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    <select value={filters.priority} onChange={set('priority')} aria-label="Filter by priority"><option value="">All priorities</option>{PRIORITIES.map((value) => <option key={value}>{value}</option>)}</select>
    <select value={filters.assigneeId} onChange={set('assigneeId')} aria-label="Filter by assignee"><option value="">All assignees</option><option value="unassigned">Unassigned</option>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select>
    <select value={`${filters.sort}:${filters.order}`} onChange={setSort} aria-label="Order cards"><option value="createdAt:desc">Newest created first</option><option value="createdAt:asc">Oldest created first</option><option value="dueDate:asc">Due date: soonest first</option><option value="dueDate:desc">Due date: latest first</option><option value="title:asc">Title: A to Z</option><option value="title:desc">Title: Z to A</option><option value="priority:desc">Priority: highest first</option><option value="priority:asc">Priority: lowest first</option></select>
    {(filters.search || filters.status || filters.priority || filters.assigneeId) && <button className="quiet" onClick={() => onChange({ ...filters, search: '', status: '', priority: '', assigneeId: '' })}>Clear</button>}
  </div>
}
