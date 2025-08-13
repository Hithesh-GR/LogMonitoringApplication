import type { RawLog, Job } from '../types';
import { hmsToSeconds } from './csv';

const WARNING = 5 * 60
const ERROR = 10 * 60

export function computeJobs(rows: RawLog[]): Job[] {
  const byPid = new Map<string, Job>()

  for (const r of rows) {
    if (!byPid.has(r.pid)) {
      byPid.set(r.pid, {
        pid: r.pid,
        description: r.description,
        status: 'INCOMPLETE',
      })
    }
    const job = byPid.get(r.pid)!

    if (r.phase === 'START') job.start = r.time
    else if (r.phase === 'END') job.end = r.time
  }

  // finalize
  for (const job of byPid.values()) {
    if (job.start && job.end) {
      const dur = Math.max(0, hmsToSeconds(job.end) - hmsToSeconds(job.start))
      job.durationSec = dur
      job.status = dur > ERROR ? 'ERROR' : dur > WARNING ? 'WARNING' : 'OK'
    } else {
      job.status = 'INCOMPLETE'
    }
  }

  return Array.from(byPid.values()).sort((a, b) => a.pid.localeCompare(b.pid))
}

export function secondsToHMS(total: number): string {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}