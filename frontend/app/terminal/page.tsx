'use client'

import AppShell from '@/components/layout/AppShell'
import { useState, useRef, useEffect } from 'react'

type Line = { type: 'input' | 'output' | 'error' | 'comment'; text: string }

const commands: Record<string, Line[]> = {
  whoami: [
    { type: 'output', text: 'Jayaraj Japagal' },
    { type: 'output', text: 'Platform & Release Engineer · Mercedes-Benz R&D India' },
    { type: 'output', text: 'Location: Bengaluru, India · 6+ years experience' },
  ],
  skills: [
    { type: 'output', text: 'Cloud:    AWS (EKS, RDS, ElastiCache, SQS, S3, CloudFront)' },
    { type: 'output', text: 'DevOps:   Kubernetes, Terraform, Docker, GitLab CI/CD, Helm' },
    { type: 'output', text: 'Backend:  Python, FastAPI, PostgreSQL, Redis' },
    { type: 'output', text: 'Obs:      Prometheus, Grafana, Loki, Promtail' },
    { type: 'output', text: 'AI:       MCP, RAG, FAISS, sentence-transformers' },
  ],
  experience: [
    { type: 'output', text: '2023→now  Mercedes-Benz R&D India — Platform & Release Engineer' },
    { type: 'output', text: '          CI/CD Intelligence, MCP/RAG, Grafana, GitLab' },
    { type: 'output', text: '2020→2023 TCS — DevOps Engineer Team Lead' },
    { type: 'output', text: '          Python APIs, Solr, Splunk, Grafana' },
    { type: 'output', text: '2015→2019 RNSIT — B.Tech Electronics & Instrumentation' },
  ],
  projects: [
    { type: 'output', text: '1. Cloud-Native E-Commerce Platform (Personal · AWS eu-central-1)' },
    { type: 'output', text: '   5 FastAPI services · EKS · Terraform · Redis · SQS · CloudFront' },
    { type: 'output', text: '   gitlab.com/Jayaraj_1437/ecommerce-system' },
    { type: 'output', text: '' },
    { type: 'output', text: '2. MCP-Based CI/CD Intelligence (Mercedes-Benz · Internal)' },
    { type: 'output', text: '   RAG + FAISS + sentence-transformers + GitHub Copilot' },
  ],
  architecture: [
    { type: 'output', text: 'CloudFront → S3 (Next.js frontend)' },
    { type: 'output', text: 'CloudFront → ALB → EKS (5 microservices)' },
    { type: 'output', text: '  ├── auth-service    :8001 · JWT · RDS' },
    { type: 'output', text: '  ├── product-service :8002 · CRUD · RDS' },
    { type: 'output', text: '  ├── cart-service    :8004 · Redis · ElastiCache' },
    { type: 'output', text: '  ├── payment-service :8005 · orchestrator' },
    { type: 'output', text: '  └── order-service   :8003 · SQS · DLQ' },
    { type: 'output', text: 'Infra: Terraform (16 files · 42 resources · S3 state)' },
    { type: 'output', text: 'Obs:   Prometheus + Grafana + Loki (Helm · monitoring ns)' },
  ],
  contact: [
    { type: 'output', text: 'Email:    jayaraj.japagal07@icloud.com' },
    { type: 'output', text: 'Phone:    +91 8197985949' },
    { type: 'output', text: 'GitLab:   gitlab.com/Jayaraj_1437' },
    { type: 'output', text: 'LinkedIn: linkedin.com/in/jayaraj-japagal' },
  ],
  resume: [
    { type: 'output', text: 'Resume available at /contact page' },
    { type: 'output', text: 'Or email: jayaraj.japagal07@icloud.com' },
  ],
  help: [
    { type: 'comment', text: 'Available commands:' },
    { type: 'output', text: '  whoami       — who is Jayaraj' },
    { type: 'output', text: '  skills       — tech stack and expertise' },
    { type: 'output', text: '  experience   — career history' },
    { type: 'output', text: '  projects     — what I built' },
    { type: 'output', text: '  architecture — AWS system design' },
    { type: 'output', text: '  contact      — get in touch' },
    { type: 'output', text: '  resume       — download resume' },
    { type: 'output', text: '  clear        — clear terminal' },
  ],
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { type: 'comment', text: '# Jayaraj Platform OS · Interactive Terminal' },
    { type: 'comment', text: '# Type "help" to see available commands' },
    { type: 'comment', text: '' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  function runCmd() {
    const cmd = input.trim().toLowerCase()
    if (!cmd) return
    const newLines: Line[] = [...lines, { type: 'input', text: cmd }]
    if (cmd === 'clear') {
      setLines([{ type: 'comment', text: '# Terminal cleared' }])
    } else if (commands[cmd]) {
      setLines([...newLines, ...commands[cmd]])
    } else {
      setLines([...newLines, { type: 'error', text: `command not found: ${cmd} — try 'help'` }])
    }
    setHistory([cmd, ...history])
    setHistIdx(-1)
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { runCmd(); return }
    if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx); setInput(history[idx] || '')
    }
    if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx); setInput(idx === -1 ? '' : history[idx])
    }
  }

  return (
    <AppShell>
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>// interactive shell</div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e4f0', letterSpacing: '-0.5px' }}>Terminal<span style={{ color: '#3b82f6' }}>.</span></h1>
              <div style={{ width: '45px', height: '2px', background: 'linear-gradient(90deg, #f97316, #3b82f6)', borderRadius: '1px', marginTop: '0.5rem' }} />
            </div>

            {/* Content card */}
            <div className="fade-up" style={{ background: 'linear-gradient(180deg, #2b3459 0%, #262e4f 100%)', border: '1px solid #3a4374', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '60ms' }}>

            {/* Terminal window */}
            <div style={{ background: '#0a0b14', border: '1px solid #252840', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Title bar */}
              <div style={{ background: '#1a1d2e', padding: '0.625rem 1rem', borderBottom: '1px solid #252840', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                  <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                ))}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3a3e60', marginLeft: '8px' }}>jayaraj@platform ~ zsh</span>
              </div>

              {/* Output */}
              <div
                style={{ padding: '1rem', minHeight: '350px', maxHeight: '500px', overflowY: 'auto', cursor: 'text' }}
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((line, i) => (
                  <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', lineHeight: '1.9', display: 'flex', gap: '8px' }}>
                    {line.type === 'input' && <><span style={{ color: '#3b82f6' }}>❯</span><span style={{ color: '#e2e4f0' }}>{line.text}</span></>}
                    {line.type === 'output' && <span style={{ color: '#8890b8', paddingLeft: '4px' }}>{line.text}</span>}
                    {line.type === 'error' && <span style={{ color: '#f87171', paddingLeft: '4px' }}>{line.text}</span>}
                    {line.type === 'comment' && <span style={{ color: '#3a3e60', paddingLeft: '4px' }}>{line.text}</span>}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ borderTop: '1px solid #252840', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#3b82f6', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>❯</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  autoFocus
                  placeholder="type a command..."
                  style={{ flex: 1, background: 'none', border: 'none', color: '#e2e4f0', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', outline: 'none' }}
                />
              </div>
            </div>

            {/* Quick commands */}
            <div style={{ background: '#1a1d2e', border: '1px solid #252840', borderRadius: '10px', padding: '1rem 1.25rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>// quick commands</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['whoami', 'skills', 'experience', 'projects', 'architecture', 'contact', 'help', 'clear'].map((cmd) => (
                  <button key={cmd} onClick={() => { setInput(cmd); setTimeout(() => { setInput(''); const newLines: Line[] = [{ type: 'input', text: cmd }]; if (cmd === 'clear') { setLines([{ type: 'comment', text: '# Terminal cleared' }]); return; } setLines(prev => [...prev, ...newLines, ...(commands[cmd] || [])]); }, 50) }}
                    className="fx-pill"
                    style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', padding: '4px 12px', background: '#12141f', border: '1px solid #252840', borderRadius: '5px', color: '#6080d0', cursor: 'pointer' }}>
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            </div>

          </div>
    </AppShell>
  )
}