'use client'

import AppShell from '@/components/layout/AppShell'
import { useState } from 'react'

const projects = [
  {
    id: 'ecommerce',
    title: 'Cloud-Native E-Commerce Platform',
    subtitle: 'Personal Project · AWS eu-central-1 · 2024',
    status: 'LIVE',
    statusColor: '#34d399',
    color: '#3b82f6',
    gitlab: 'https://gitlab.com/Jayaraj_1437/ecommerce-system',
    desc: 'Production-grade microservices platform built on AWS to develop deep hands-on expertise in cloud-native architecture, DevOps practices, Terraform IaC, and AI-powered operational workflows. Every architectural decision was treated as a real engineering decision.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'AWS EKS', 'Terraform', 'Docker', 'SQS', 'S3', 'CloudFront', 'Next.js', 'Prometheus', 'Grafana', 'Loki', 'Helm'],
    highlights: [
      { label: '5 Microservices', desc: 'auth, products, cart, payment, orders — each independently deployed on EKS' },
      { label: 'Terraform IaC', desc: '16 .tf files managing 42 AWS resources — VPC, EKS, RDS, ElastiCache, SQS, IAM' },
      { label: 'Redis Cart', desc: 'ElastiCache Redis with Hash structure per user, 7-day TTL, sub-millisecond reads' },
      { label: 'SQS Async', desc: 'Order processing via SQS — email, inventory, invoice, warehouse. DLQ for failures' },
      { label: 'IRSA Security', desc: 'No hardcoded AWS keys. OIDC + ServiceAccount + IAM trust policy for pod-level access' },
      { label: 'Observability', desc: 'Prometheus + Grafana + Loki via Helm. Real-time metrics, dashboards, centralized logs' },
    ],
    architecture: 'CloudFront → S3 (frontend) + ALB → EKS (5 services) → RDS + Redis + SQS',
  },
  {
    id: 'mcp',
    title: 'MCP-Based CI/CD Intelligence Platform',
    subtitle: 'Mercedes-Benz R&D India · 2024 · Internal',
    status: 'INTERNAL',
    statusColor: '#8b5cf6',
    color: '#8b5cf6',
    gitlab: null,
    desc: 'MCP (Model Context Protocol) server exposing CI/CD log analysis tools to GitHub Copilot. Enables developers to diagnose pipeline failures without leaving their IDE. RAG pipeline searches 100k+ line logs in real time.',
    stack: ['Python', 'MCP', 'RAG', 'FAISS', 'sentence-transformers', 'FastAPI', 'GitLab CI/CD', 'PostgreSQL'],
    highlights: [
      { label: 'MCP Server', desc: 'Exposes CI/CD log search, pipeline status, and failure analysis tools to GitHub Copilot' },
      { label: 'RAG Pipeline', desc: 'sentence-transformers (all-MiniLM-L6-v2) + FAISS index over chunked pipeline logs' },
      { label: 'Real-time Search', desc: 'Engineers query 100k+ line CI/CD logs directly from their IDE in milliseconds' },
      { label: 'Release Letters', desc: 'AI-assisted release letter generation — auto-creates summaries after release approvals' },
      { label: 'Analytics', desc: 'PostgreSQL-based CI/CD analytics across Gerrit, GitLab, Jira, and pipeline ecosystems' },
    ],
    architecture: 'GitHub Copilot → MCP Server → RAG (FAISS) → CI/CD Logs + PostgreSQL',
  },
]

export default function Projects() {
  const [expanded, setExpanded] = useState<string | null>('ecommerce')

  return (
    <AppShell>
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>// production work</div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e4f0', letterSpacing: '-0.5px' }}>
                Projects<span style={{ color: '#3b82f6' }}>.</span>
              </h1>
              <div style={{ width: '45px', height: '2px', background: 'linear-gradient(90deg, #f97316, #3b82f6)', borderRadius: '1px', marginTop: '0.5rem' }} />
            </div>

            {/* Projects */}
            <div className="fade-up" style={{ background: 'linear-gradient(180deg, #2b3459 0%, #262e4f 100%)', border: '1px solid #3a4374', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '60ms' }}>
            {projects.map((proj, i) => (
              <div key={proj.id} className="fx-card fade-up" style={{ background: '#1a1d2e', border: '1px solid #252840', borderLeft: `3px solid ${proj.color}`, borderRadius: '10px', overflow: 'hidden', animationDelay: `${i * 80}ms` }}>

                {/* Header */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 700, color: '#e2e4f0', marginBottom: '4px' }}>{proj.title}</div>
                      <div style={{ fontSize: '11px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace' }}>{proj.subtitle}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '1rem' }}>
                      <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: proj.statusColor, background: `${proj.statusColor}15`, border: `1px solid ${proj.statusColor}30`, padding: '3px 8px', borderRadius: '4px' }}>{proj.status}</span>
                      {proj.gitlab && (
                        <a href={proj.gitlab} target="_blank" rel="noreferrer" className="fx-btn-outline" style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: proj.color, background: 'transparent', border: `1px solid ${proj.color}30`, padding: '3px 10px', borderRadius: '5px', textDecoration: 'none' }}>GitLab →</a>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#6068a0', lineHeight: 1.7, marginBottom: '1rem' }}>{proj.desc}</p>

                  {/* Architecture */}
                  <div style={{ background: '#12141f', border: '1px solid #252840', borderRadius: '7px', padding: '0.625rem 1rem', marginBottom: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5a5e80' }}>
                    <span style={{ color: proj.color, marginRight: '8px' }}>arch:</span>{proj.architecture}
                  </div>

                  {/* Stack */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {proj.stack.map((s) => (
                      <span key={s} className="fx-pill" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', padding: '2px 8px', borderRadius: '4px', background: 'rgba(59,130,246,0.06)', color: '#6080d0', border: '1px solid rgba(59,130,246,0.15)' }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Toggle */}
                <div onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}
                  style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid #252840', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#5a5e80' }}>
                    {expanded === proj.id ? '// hide highlights' : '// view highlights'}
                  </span>
                  <span style={{ color: '#5a5e80', fontSize: '16px' }}>{expanded === proj.id ? '−' : '+'}</span>
                </div>

                {/* Highlights */}
                {expanded === proj.id && (
                  <div style={{ borderTop: '1px solid #252840', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {proj.highlights.map((h) => (
                        <div key={h.label} style={{ background: '#12141f', border: '1px solid #252840', borderRadius: '8px', padding: '0.875rem' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: proj.color, marginBottom: '5px', fontFamily: 'JetBrains Mono, monospace' }}>{h.label}</div>
                          <div style={{ fontSize: '12px', color: '#6068a0', lineHeight: 1.6 }}>{h.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>

          </div>
    </AppShell>
  )
}