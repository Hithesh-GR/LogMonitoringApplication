import { parseCsv } from '../lib/csv';
import type { RawLog } from '../types';
import { useState } from 'react';

export default function FileUpload({ onParsed }: { onParsed: (rows: RawLog[]) => void }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    try {
      const rows = await parseCsv(f)
      setName(f.name)
      onParsed(rows)
    } finally { setBusy(false) }
  }

  return (
    <div className="card input">
      <label><strong>Upload log (.csv / .log)</strong></label>
      <input type="file" accept=".csv,.log,text/csv,text/plain" onChange={handleChange} />
      <small>{busy ? 'Parsing…' : name ? `Loaded: ${name}` : 'No file selected'}</small>
    </div>
  )
}