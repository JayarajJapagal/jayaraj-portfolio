'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      background: [
        'radial-gradient(1000px 500px at 12% -8%, rgba(96,118,210,0.40) 0%, rgba(96,118,210,0) 60%)',
        'radial-gradient(800px 460px at 108% 112%, rgba(139,92,246,0.28) 0%, rgba(139,92,246,0) 55%)',
        'radial-gradient(700px 380px at 88% -6%, rgba(249,115,22,0.10) 0%, rgba(249,115,22,0) 50%)',
        '#232b47',
      ].join(', '),
    }}>
      <style>{`
        @keyframes orbDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(60px, 40px) scale(1.08); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-50px, -35px) scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bg-orb { animation: none !important; }
        }
      `}</style>

      {/* ambient glow orbs */}
      <div className="bg-orb" aria-hidden style={{
        position: 'absolute', top: '-120px', left: '18%', width: '420px', height: '420px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)',
        filter: 'blur(70px)', animation: 'orbDrift 18s ease-in-out infinite', pointerEvents: 'none',
      }} />
      <div className="bg-orb" aria-hidden style={{
        position: 'absolute', bottom: '-140px', right: '10%', width: '460px', height: '460px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.30), transparent 70%)',
        filter: 'blur(80px)', animation: 'orbDrift2 22s ease-in-out infinite', pointerEvents: 'none',
      }} />

      {/* dot grid overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(148,163,255,0.10) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.35))',
        WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.35))',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gridTemplateRows: '56px 1fr',
        gap: '14px',
        padding: '14px',
        height: '100%',
        width: '100%',
        maxWidth: '1040px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ gridRow: '1 / 3', minHeight: 0 }}>
          <Sidebar />
        </div>
        <Topbar />
        <main style={{
          minHeight: 0,
          overflowY: 'auto',
          background: 'linear-gradient(180deg, rgba(40,48,79,0.92) 0%, rgba(35,43,71,0.92) 100%)',
          border: '1px solid #333c66',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
