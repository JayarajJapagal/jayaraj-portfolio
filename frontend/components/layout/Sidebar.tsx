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
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #151a2e 0%, #0f131f 100%)',
      border: '1px solid #2c3357',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{`
        .sb-link:hover { background: rgba(148,163,255,0.08) !important; color: #dbe2ff !important; transform: translateX(2px); }
        .sb-icon { transition: transform 0.15s ease; }
        .sb-link:hover .sb-icon { transform: scale(1.15); }
        @keyframes sb-led { 50% { opacity: 0.4; } }
        @media (prefers-reduced-motion: reduce) {
          .sb-link:hover { transform: none; }
          .sb-link:hover .sb-icon { transform: none; }
          .sb-led { animation: none !important; }
        }
      `}</style>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #232a49' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px',
          background: 'linear-gradient(90deg, #7dd3fc, #a78bfa)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>jayaraj@platform</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6b74a8', marginTop: '3px' }}>Platform Engineer · v6.0</div>
      </div>

      <nav style={{ padding: '0.5rem', flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname === `${item.href}/`
          return (
            <Link key={item.href} href={item.href} className="sb-link" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', margin: '2px 0', borderRadius: '9px',
              border: isActive ? '1px solid rgba(56,189,248,0.3)' : '1px solid transparent',
              background: isActive ? 'linear-gradient(90deg, rgba(56,189,248,0.14), rgba(167,139,250,0.07))' : 'transparent',
              color: isActive ? '#7dd3fc' : '#a6aed6',
              fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 500, letterSpacing: '1px',
              textDecoration: 'none', transition: 'all 0.15s',
            }}>
              <span className="sb-icon" style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              <span style={{
                marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%',
                background: isActive ? '#34d399' : '#39406b',
                boxShadow: isActive ? '0 0 6px #34d399' : 'none', flexShrink: 0,
              }} />
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #232a49' }}>
        {['EKS · 5 pods', 'Terraform · clean', 'AI · online'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#7c86b8', fontFamily: 'JetBrains Mono, monospace', lineHeight: 2 }}>
            <span className="sb-led" style={{
              width: '5px', height: '5px', borderRadius: '50%', background: '#34d399',
              boxShadow: '0 0 5px rgba(52,211,153,0.7)', flexShrink: 0,
              animation: `sb-led 2.4s ease-in-out ${i * 0.4}s infinite`,
            }} />{s}
          </div>
        ))}
      </div>
    </aside>
  )
}
