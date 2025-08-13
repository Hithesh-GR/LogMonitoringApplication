import Papa from 'papaparse';
import type { RawLog } from '../types';

export function parseCsv(file: File): Promise<RawLog[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawLog>(file, {
      header: false,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = res.data as unknown as string[][]
        // Expecting columns: HH:MM:SS, description, phase, PID
        const parsed: RawLog[] = rows.map((r) => ({
          time: String(r[0] ?? '').trim(),
          description: String(r[1] ?? '').trim(),
          phase: String(r[2] ?? '').trim().toUpperCase() as any,
          pid: String(r[3] ?? '').trim(),
        }))
        resolve(parsed)
      },
      error: reject,
    })
  })
}

export function hmsToSeconds(hms: string): number {
  const [h, m, s] = hms.split(':').map(Number)
  if ([h, m, s].some((n) => Number.isNaN(n))) return 0
  return h * 3600 + m * 60 + s
}