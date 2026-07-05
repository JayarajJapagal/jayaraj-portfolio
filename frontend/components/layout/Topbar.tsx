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
      height: '48px',
      background: '#0d0d12',
      borderBottom: '1px solid #1c1c28',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px',
        fontWeight: 500,
        color: '#c8cce8',
      }}>
        Platform Command Center
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: '#2e2e48',
        }}>
          {time}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          padding: '3px 10px',
          borderRadius: '4px',
          background: 'rgba(52,211,153,0.08)',
          color: '#34d399',
          border: '1px solid rgba(52,211,153,0.15)',
        }}>
          All Systems Operational
        </span>
¸      </div>
    </header>
  )
}
