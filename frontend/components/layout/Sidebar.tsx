'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/',             icon: '👤', label: 'About'     },
  { href: '/experience',   icon: '📋', label: 'Resume'    },
  { href: '/skills',       icon: '⬢',  label: 'Skills'    },
  { href: '/projects',     icon: '○',  label: 'Projects'  },
  { href: '/architecture', icon: '◈',  label: 'Infrastructure'  },
  { href: '/terminal',     icon: '>_', label: 'Terminal'  },
  { href: '/ai',           icon: '◆',  label: 'AI Chat'   },
  { href: '/contact',      icon: '✉',  label: 'Contact'   },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '200px', background: '#0d0d12',
      borderRight: '1px solid #1c1c28',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, height: '100vh',
    }}>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #1c1c28' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600, color: '#c8cce8', letterSpacing: '0.5px' }}>jayaraj@platform</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2e2e48', marginTop: '3px' }}>Platform Engineer · v6.0</div>
      </div>

      <nav style={{ padding: '0.5rem', flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', margin: '2px 0', borderRadius: '7px',
              border: isActive ? '1px solid rgba(56,189,248,0.2)' : '1px solid transparent',
              background: isActive ? 'rgba(56,189,248,0.06)' : 'transparent',
              color: isActive ? '#38bdf8' : '#44446a',
              fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 500, letterSpacing: '1px',
              textDecoration: 'none', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              <span style={{
                marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%',
                background: isActive ? '#34d399' : '#1e1e32',
                boxShadow: isActive ? '0 0 6px #34d399' : 'none', flexShrink: 0,
              }} />
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #1c1c28' }}>
        {['EKS · 5 pods', 'Terraform · clean', 'AI · online'].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#2e2e48', fontFamily: 'JetBrains Mono, monospace', lineHeight: 2 }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />{s}
          </div>
        ))}
      </div>
    </aside>
  )
}