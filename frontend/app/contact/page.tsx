'use client'

import AppShell from '@/components/layout/AppShell'
import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', role: '', message: '' })

  return (
    <AppShell>
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>// get in touch</div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e4f0', letterSpacing: '-0.5px' }}>Contact<span style={{ color: '#3b82f6' }}>.</span></h1>
              <div style={{ width: '45px', height: '2px', background: 'linear-gradient(90deg, #f97316, #3b82f6)', borderRadius: '1px', marginTop: '0.5rem' }} />
            </div>

            {/* Content card */}
            <div className="fade-up" style={{ background: 'linear-gradient(180deg, #2b3459 0%, #262e4f 100%)', border: '1px solid #3a4374', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '60ms' }}>

            {/* Links */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '📧', label: 'Email', value: 'jayaraj.japagal07@icloud.com', href: 'mailto:jayaraj.japagal07@icloud.com', download: false, color: '#3b82f6' },
                { icon: '📱', label: 'Phone', value: '+91 8197985949', href: 'tel:8197985949', download: false, color: '#34d399' },
                { icon: '⬡', label: 'GitLab', value: 'gitlab.com/Jayaraj_1437', href: 'https://gitlab.com/Jayaraj_1437', download: false, color: '#f97316' },
                { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/jayaraj-japagal', href: 'https://www.linkedin.com/in/jayaraj-japagal-1a106315b/', download: false, color: '#22d3ee' },
                { icon: '📄', label: 'Resume', value: 'Download PDF', href: '/resume.pdf', download: true, color: '#8b5cf6' },
                { icon: '📍', label: 'Location', value: 'Bengaluru, India', href: null, download: false, color: '#f87171' },
              ].map((link, i) => (
                <a
                  key={link.label}
                  href={link.href || '#'}
                  target={link.href?.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  download={link.download ? true : undefined}
                  className="fx-card fade-up"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: '#1a1d2e', border: '1px solid #252840',
                    borderRadius: '10px', padding: '1rem',
                    textDecoration: 'none',
                    cursor: link.href ? 'pointer' : 'default',
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${link.color}12`, border: `1px solid ${link.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{link.icon}</div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: '#e2e4f0' }}>{link.label}</div>
                    <div style={{ fontSize: '11px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>{link.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Message form */}
            <div className="fade-up" style={{ background: '#1a1d2e', border: '1px solid #252840', borderRadius: '10px', padding: '1.5rem', animationDelay: '360ms' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>// send a message</div>

              {submitted ? (
                <div style={{ background: '#0c0e1a', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '8px', padding: '1.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#34d399', lineHeight: 2 }}>
                  <div>&gt; message received from {form.name} at {form.company}</div>
                  <div>&gt; adding to queue...</div>
                  <div>&gt; jayaraj will be in touch soon.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { key: 'name', label: 'name', placeholder: 'Your name' },
                      { key: 'company', label: 'company', placeholder: 'Company' },
                      { key: 'email', label: 'email', placeholder: 'email@company.com' },
                      { key: 'role', label: 'role hiring for', placeholder: 'Senior Platform Engineer' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '5px' }}>{f.label}</label>
                        <input
                          value={form[f.key as keyof typeof form]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          className="fx-input"
                          style={{ width: '100%', background: '#12141f', border: '1px solid #252840', borderRadius: '7px', padding: '9px 12px', fontSize: '13px', color: '#e2e4f0', fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '5px' }}>message</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="What are you looking for?"
                      rows={4}
                      className="fx-input"
                      style={{ width: '100%', background: '#12141f', border: '1px solid #252840', borderRadius: '7px', padding: '9px 12px', fontSize: '13px', color: '#e2e4f0', fontFamily: 'JetBrains Mono, monospace', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                  <button
                    onClick={() => { if (form.name && form.email) setSubmitted(true) }}
                    className="fx-btn"
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '11px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    Send message →
                  </button>
                </div>
              )}
            </div>

            </div>

          </div>
    </AppShell>
  )
}