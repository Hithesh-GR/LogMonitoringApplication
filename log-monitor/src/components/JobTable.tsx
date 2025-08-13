import type { Job } from '../types';
import { secondsToHMS } from '../lib/jobs';
import { useMemo, useState } from 'react';

export default function JobTable({ jobs }: { jobs: Job[] }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'ALL' | Job['status']>('ALL')
  const [sort, setSort] = useState<'pid' | 'duration'>('pid')

  const data = useMemo(() => {
    let out = jobs
    if (q) {
      const k = q.toLowerCase()
      out = out.filter(j => j.pid.includes(q) || j.description.toLowerCase().includes(k))
    }
    if (status !== 'ALL') out = out.filter(j => j.status === status)
    out = [...out].sort((a,b)=> sort==='pid' ? a.pid.localeCompare(b.pid) : (b.durationSec ?? 0) - (a.durationSec ?? 0))
    return out
  }, [jobs, q, status, sort])

  function badge(s: Job['status']) {
    if (s === 'OK') return <span className="badge ok">OK</span>
    if (s === 'WARNING') return <span className="badge warn">Warning</span>
    if (s === 'ERROR') return <span className="badge err">Error</span>
    return <span className="badge" style={{border:'1px solid var(--border)'}}>Incomplete</span>
  }

  if (!jobs.length) return <p className="empty">Upload a file to see results.</p>

  return (
    <div className="card">
      <div className="controls" style={{marginBottom:'.6rem'}}>
        <input type="search" placeholder="Search PID or description" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={status} onChange={e=>setStatus(e.target.value as any)}>
          <option value="ALL">All statuses</option>
          <option value="OK">OK</option>
          <option value="WARNING">Warning</option>
          <option value="ERROR">Error</option>
          <option value="INCOMPLETE">Incomplete</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value as any)}>
          <option value="pid">Sort by PID</option>
          <option value="duration">Sort by Duration</option>
        </select>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>PID</th>
              <th>Description</th>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map(j => (
              <tr key={j.pid}>
                <td>{j.pid}</td>
                <td>{j.description}</td>
                <td>{j.start ?? '—'}</td>
                <td>{j.end ?? '—'}</td>
                <td>{j.durationSec != null ? secondsToHMS(j.durationSec) : '—'}</td>
                <td>{badge(j.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}