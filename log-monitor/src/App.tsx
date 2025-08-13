import { useState } from 'react';
import FileUpload from './components/FileUpload';
import JobTable from './components/JobTable';
import Summary from './components/Summary';
import { computeJobs } from './lib/jobs';
import type { RawLog, Job } from './types';
import './styles.css';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([])

  function onParsed(rows: RawLog[]) {
    const result = computeJobs(rows)
    setJobs(result)
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Log Monitoring Dashboard</h1>
      </header>

      <div className="grid">
        <aside>
          <FileUpload onParsed={onParsed} />
          <Summary jobs={jobs} />
        </aside>
        <main>
          <JobTable jobs={jobs} />
        </main>
      </div>
    </div>
  )
}