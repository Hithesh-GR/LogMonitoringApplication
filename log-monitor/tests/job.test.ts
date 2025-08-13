import { describe, it, expect } from 'vitest';
import { computeJobs, secondsToHMS } from '../src/lib/jobs';
import type { RawLog } from '../src/types';

describe('jobs', () => {
  it('pairs START/END by PID and computes status', () => {
    const rows: RawLog[] = [
      { time:'00:00:00', description:'Task A', phase:'START', pid:'1' },
      { time:'00:04:59', description:'Task A', phase:'END', pid:'1' },
      { time:'00:00:00', description:'Task B', phase:'START', pid:'2' },
      { time:'00:05:30', description:'Task B', phase:'END', pid:'2' },
      { time:'00:00:00', description:'Task C', phase:'START', pid:'3' },
      { time:'00:10:01', description:'Task C', phase:'END', pid:'3' },
    ]
    const jobs = computeJobs(rows)
    expect(jobs.map(j=>j.status)).toEqual(['OK', 'WARNING', 'ERROR'])
  })

  it('secondsToHMS', () => {
    expect(secondsToHMS(0)).toBe('00:00:00')
    expect(secondsToHMS(65)).toBe('00:01:05')
    expect(secondsToHMS(3661)).toBe('01:01:01')
  })
})