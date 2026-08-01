import { PRIORITIES } from '../../constants/tasks'

export function PriorityFilter({ value, onChange }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} aria-label="Filter by priority">
    <option value="">All priorities</option>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
  </select>
}
