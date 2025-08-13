import type { Job } from '../types';

export default function Summary({ jobs }: { jobs: Job[] }) {
  const total = jobs.length
  const ok = jobs.filter(j => j.status === 'OK').length
  const warn = jobs.filter(j => j.status === 'WARNING').length
  const err = jobs.filter(j => j.status === 'ERROR').length
  const inc = jobs.filter(j => j.status === 'INCOMPLETE').length

  return (
    <div className="card" style={{display:'grid', gap:'.6rem'}}>
      <strong>Summary</strong>
      <div className="controls">
        <span className="badge ok">OK {ok}</span>
        <span className="badge warn">Warning {warn}</span>
        <span className="badge err">Error {err}</span>
        <span className="badge" style={{border:'1px solid var(--border)'}}>Incomplete {inc}</span>
        <span style={{marginLeft:'auto', opacity:.8}}>Total: {total}</span>
      </div>
    </div>
  )
}