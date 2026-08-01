import { navigate } from '../../lib/navigation'

export function Brand() {
  return <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>TEAMFLOW</a>
}
