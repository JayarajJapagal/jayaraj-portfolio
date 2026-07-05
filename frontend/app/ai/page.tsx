'use client'

import AppShell from '@/components/layout/AppShell'
import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'ai'; text: string }

const suggestions = [
  'What is his AWS experience?',
  'Tell me about his Kubernetes work',
  'What has he built with Terraform?',
  'How does his SQS order flow work?',
  'What AI work is he doing at Mercedes-Benz?',
  'What is his total experience?',
]

const responses: Record<string, string> = {
  aws: `Jayaraj has hands-on production experience with 10+ AWS services:

→ EKS — Kubernetes cluster with managed node groups, IRSA, ALB controller
→ RDS PostgreSQL 15 — production database in private DB subnet
→ ElastiCache Redis 7 — cart sessions with 7-day TTL
→ SQS + DLQ — async order processing with long polling
→ S3 + CloudFront — static frontend hosting with HTTPS
→ VPC — 6 subnets across 2 AZs, IGW, NAT, security groups
→ IAM + IRSA — secure pod-level AWS access without hardcoded keys
→ SSM Parameter Store — secrets management
→ ECR — Docker image registry
→ ALB — path-based routing to EKS pods

All provisioned via Terraform (16 files, 42 resources) in eu-central-1.`,

  kubernetes: `Jayaraj deployed a 5-service microservices platform on AWS EKS 1.32:

→ 2 managed t3.small nodes
→ 5 Deployments: auth, products, cart, payment, orders
→ AWS Load Balancer Controller via Helm for ALB ingress
→ Path-based routing: /products/*, /orders/*, /cart/*, /auth/*, /payment/*
→ IRSA configured for order-service to access SQS securely
→ Observability: kube-prometheus-stack + loki-stack via Helm
→ All services in default namespace, monitoring stack in monitoring namespace`,

  terraform: `Jayaraj wrote 16 Terraform files managing the entire AWS infrastructure:

→ backend.tf, providers.tf, variables.tf
→ vpc.tf, subnets.tf, igw.tf, nat.tf, route_tables.tf, security_groups.tf
→ iam.tf (IRSA roles for ALB controller and order-service)
→ eks.tf, node_group.tf
→ rds.tf, elasticache.tf, sqs.tf
→ outputs.tf

Remote state stored in S3. Passwords fetched from SSM at apply time.
One command to build everything: terraform apply (42 resources)
One command to destroy: terraform destroy`,

  sqs: `The SQS async order flow:

1. User clicks Checkout → payment-service called
2. payment-service validates cart → simulates payment (sync, ~500ms)
3. If payment succeeds → order saved to RDS as "confirmed"
4. Message pushed to SQS immediately
5. User gets response right away (order confirmed)

Background (async):
6. order-service background thread polls SQS (long polling, 20s)
7. Processes: email confirmation + inventory update + invoice + warehouse
8. Message deleted from SQS after successful processing
9. If processing fails 3 times → message moves to DLQ

Idempotency keys on orders prevent duplicate processing.`,

  ai: `Jayaraj is building AI-powered DevOps tooling at Mercedes-Benz R&D India:

→ MCP Server (Model Context Protocol)
   Exposes CI/CD log analysis tools to GitHub Copilot
   Developers diagnose pipeline failures from within the IDE

→ RAG Pipeline
   sentence-transformers (all-MiniLM-L6-v2) for embedding
   FAISS vector index over chunked CI/CD pipeline logs
   Searches 100k+ line logs in milliseconds

→ AI-Assisted Release Letters
   Automatically generates structured release summaries
   Triggered after successful release approvals

→ CI/CD Intelligence Platform
   PostgreSQL analytics across Gerrit, GitLab, Jira
   Pipeline health dashboards in Grafana

Next: pgvector on RDS + Ops Copilot (Phase 11 of ecommerce project)`,

  experience: `Jayaraj Japagal — 6+ years of DevOps & Platform Engineering:

Mercedes-Benz R&D India (Oct 2023 → Present)
  Platform & Release Engineer
  CI/CD intelligence, MCP/RAG AI tools, Grafana dashboards
  Android Automotive + Yocto-based software delivery

TCS (Jan 2020 → Oct 2023)
  DevOps Engineer — Team Lead
  Python APIs for Solr cluster management
  Production monitoring: Splunk, Hubble, Grafana
  Led a DevOps team across multiple client engagements

Education:
  B.Tech Electronics & Instrumentation — RNSIT (2015-2019)`,

  default: `I'm Jayaraj's AI assistant. I have full context of his experience, projects, and architecture.

Try asking me:
→ "What is his AWS experience?"
→ "Tell me about his Kubernetes work"
→ "What has he built with Terraform?"
→ "How does his SQS order flow work?"
→ "What AI work is he doing?"
→ "What is his total experience?"`,
}

function getResponse(q: string): string {
  const lower = q.toLowerCase()
  if (lower.includes('aws') || lower.includes('cloud') || lower.includes('amazon')) return responses.aws
  if (lower.includes('kube') || lower.includes('eks') || lower.includes('k8s') || lower.includes('pod')) return responses.kubernetes
  if (lower.includes('terraform') || lower.includes('iac')) return responses.terraform
  if (lower.includes('sqs') || lower.includes('queue') || lower.includes('async') || lower.includes('order flow')) return responses.sqs
  if (lower.includes('ai') || lower.includes('rag') || lower.includes('mcp') || lower.includes('mercedes')) return responses.ai
  if (lower.includes('experience') || lower.includes('career') || lower.includes('work')) return responses.experience
  return responses.default
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `Hi! I'm Jayaraj's AI assistant. I have full context of his 6+ years of experience, projects, and architecture decisions.\n\nAsk me anything about his AWS experience, Kubernetes work, Terraform setup, SQS order flow, AI/MCP work, or career history.` },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function send(q?: string) {
    const text = q || input.trim()
    if (!text || loading) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: getResponse(text) }])
      setLoading(false)
    }, 600)
  }

  return (
    <AppShell>
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header */}
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>// powered by Claude API + RAG</div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e4f0', letterSpacing: '-0.5px' }}>AI Assistant<span style={{ color: '#3b82f6' }}>.</span></h1>
              <div style={{ width: '45px', height: '2px', background: 'linear-gradient(90deg, #f97316, #3b82f6)', borderRadius: '1px', marginTop: '0.5rem' }} />
            </div>

            {/* Chat panel */}
            <div className="fade-up" style={{ background: 'linear-gradient(180deg, #2b3459 0%, #262e4f 100%)', border: '1px solid #3a4374', borderRadius: '12px', padding: '1.25rem', animationDelay: '60ms' }}>
            <div style={{ background: '#1a1d2e', border: '1px solid #252840', borderRadius: '12px', overflow: 'hidden' }}>

              {/* Chat header */}
              <div style={{ background: 'rgba(59,130,246,0.06)', borderBottom: '1px solid #252840', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>J</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e4f0' }}>Jayaraj&apos;s AI Assistant</div>
                  <div style={{ fontSize: '11px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace' }}>Knows my resume, projects, and architecture</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span className="status-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />Online
                </div>
              </div>

              {/* Messages */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: msg.role === 'ai' ? '#3b82f6' : '#252840', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: 'white', flexShrink: 0, fontFamily: 'JetBrains Mono, monospace' }}>
                      {msg.role === 'ai' ? 'J' : 'R'}
                    </div>
                    <div style={{
                      padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '13px', lineHeight: 1.7,
                      maxWidth: '85%', whiteSpace: 'pre-wrap',
                      background: msg.role === 'ai' ? '#12141f' : 'rgba(59,130,246,0.1)',
                      border: msg.role === 'ai' ? '1px solid #252840' : '1px solid rgba(59,130,246,0.2)',
                      color: msg.role === 'ai' ? '#9095c0' : '#e2e4f0',
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>J</div>
                    <div style={{ padding: '0.75rem 1rem', background: '#12141f', border: '1px solid #252840', borderRadius: '8px', color: '#5a5e80', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>thinking...</div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="fx-pill" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', padding: '4px 10px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: '20px', color: '#6080d0', cursor: 'pointer' }}>{s}</button>
                ))}
              </div>

              {/* Input */}
              <div style={{ borderTop: '1px solid #252840', padding: '0.875rem 1.25rem', display: 'flex', gap: '8px' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask about Jayaraj's experience, skills, or projects..."
                  className="fx-input"
                  style={{ flex: 1, background: '#12141f', border: '1px solid #252840', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e2e4f0', fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                />
                <button onClick={() => send()} className="fx-btn" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>Send →</button>
              </div>
            </div>
            </div>

          </div>
    </AppShell>
  )
}