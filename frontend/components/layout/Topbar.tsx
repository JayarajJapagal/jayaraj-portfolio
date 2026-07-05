'use client'

import { useEffect, useState } from 'react'

export default function Topbar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-GB'))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header style={{
      height: '100%',
      background: 'linear-gradient(180deg, #151a2e 0%, #0f131f 100%)',
      border: '1px solid #2c3357',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px',
        fontWeight: 500,
        color: '#dbe2ff',
      }}>
        Platform Command Center
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: '#6b74a8',
        }}>
          {time}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          padding: '3px 10px',
          borderRadius: '6px',
          background: 'rgba(52,211,153,0.08)',
          color: '#34d399',
          border: '1px solid rgba(52,211,153,0.15)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
        }}>
          <span className="status-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 5px rgba(52,211,153,0.7)', flexShrink: 0 }} />
          All Systems Operational
        </span>
      </div>
    </header>
  )
}
