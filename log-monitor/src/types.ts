export type Phase = 'START' | 'END'

export interface RawLog {
  time: string // HH:MM:SS
  description: string
  phase: Phase
  pid: string
}

export interface Job {
  pid: string
  description: string
  start?: string
  end?: string
  durationSec?: number
  status: 'OK' | 'WARNING' | 'ERROR' | 'INCOMPLETE'
}