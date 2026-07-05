'use client'

import AppShell from '@/components/layout/AppShell'

export default function Home() {
  return (
    <AppShell>
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* About card */}
            <div className="fade-up" style={{ background: '#161b2b', border: '1px solid #252840', borderRadius: '12px', padding: '2rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                <span style={{ color: '#3b82f6' }}>◆</span>
                Senior DevOps & Platform Engineer · Bengaluru, IN · 6+ yrs at scale
              </div>

              <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#e2e4f0', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>
                About Me<span style={{ color: '#3b82f6' }}>.</span>
              </h1>

              <div style={{ width: '55px', height: '2px', background: 'linear-gradient(90deg, #f97316, #3b82f6)', borderRadius: '1px', marginBottom: '1.5rem' }} />

              <div style={{ width: '100%', height: '1px', background: '#252840', marginBottom: '1.5rem' }} />

              <p style={{ fontSize: '15px', color: '#9095c0', lineHeight: 1.85, marginBottom: '1rem' }}>
                Platform and Release Engineer at Mercedes-Benz R&D India, building CI/CD intelligence
                platforms and AI-assisted engineering tools for automotive software delivery at scale.
                I design systems that make software faster to ship, easier to debug, and smarter about themselves.
              </p>
              <p style={{ fontSize: '15px', color: '#9095c0', lineHeight: 1.85, marginBottom: '1rem' }}>
                My work spans GitLab CI/CD pipelines for Android Automotive, MCP-based tools that let
                GitHub Copilot diagnose pipeline failures, and RAG systems that search 100k+ CI log lines in real time.
                Before Mercedes-Benz, I led a DevOps team at TCS building Python APIs, Solr cluster tooling, and monitoring infrastructure.
              </p>
              <p style={{ fontSize: '15px', color: '#9095c0', lineHeight: 1.85 }}>
                Actively deepening expertise in cloud architecture, Kubernetes, distributed systems,
                and AI-augmented DevOps — working toward architect-level proficiency.
              </p>
            </div>

            {/* Stats */}
            <div className="fade-up" style={{ background: '#161b2b', border: '1px solid #252840', borderRadius: '12px', padding: '1.75rem', animationDelay: '80ms' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#e2e4f0', marginBottom: '1.25rem' }}>By the Numbers</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { val: '6+', label: 'Years Experience' },
                  { val: '5',  label: 'Microservices Built' },
                  { val: '16', label: 'Terraform Files' },
                  { val: '2',  label: 'Companies' },
                ].map((s) => (
                  <div key={s.label} className="fx-card" style={{ background: '#1b2236', border: '1px solid #252840', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6', fontFamily: 'JetBrains Mono, monospace' }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: '#5a5e80', marginTop: '6px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* What I am doing */}
            <div className="fade-up" style={{ background: '#161b2b', border: '1px solid #252840', borderRadius: '12px', padding: '1.75rem', animationDelay: '160ms' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#e2e4f0', marginBottom: '1.25rem' }}>What I&apos;m Doing</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { icon: '☁', title: 'Cloud Architecture', desc: 'Designing and building AWS infrastructure — VPC, EKS, RDS, ElastiCache, SQS, CloudFront with Terraform IaC.', tag: 'CLOUD' },
                  { icon: '☸', title: 'Kubernetes & EKS', desc: 'Running production microservices on EKS with IRSA, ALB ingress controller, Helm, and managed node groups.', tag: 'DEVOPS' },
                  { icon: '◎', title: 'Observability & SRE', desc: 'Building Prometheus + Grafana + Loki stacks for real-time metrics, alerting, and centralized log aggregation.', tag: 'SRE' },
                  { icon: '◆', title: 'AI & RAG Engineering', desc: 'Building MCP servers and RAG pipelines using sentence-transformers and FAISS to power AI-assisted DevOps workflows.', tag: 'AI' },
                  { icon: '◈', title: 'Terraform & IaC', desc: 'Writing modular Terraform — VPC, EKS, RDS, SQS, IAM — with remote state in S3 and secrets in SSM.', tag: 'IaC' },
                  { icon: '⬡', title: 'GitLab CI/CD', desc: 'Designing and maintaining CI/CD pipelines for automotive-scale software delivery at Mercedes-Benz R&D India.', tag: 'CI/CD' },
                ].map((item) => (
                  <div key={item.title} className="fx-card" style={{ background: '#1b2236', border: '1px solid #252840', borderRadius: '10px', padding: '1.25rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#161b2b', border: '1px solid #252840', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e4f0' }}>{item.title}</div>
                        <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '1px 6px', borderRadius: '3px', flexShrink: 0, marginLeft: '8px' }}>{item.tag}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#5a5e80', lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack */}
            <div className="fade-up" style={{ background: '#161b2b', border: '1px solid #252840', borderRadius: '12px', padding: '1.75rem', animationDelay: '240ms' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#e2e4f0', marginBottom: '1.25rem' }}>Tech Stack</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { name: 'AWS', color: '#f97316' },
                  { name: 'Kubernetes', color: '#3b82f6' },
                  { name: 'Terraform', color: '#8b5cf6' },
                  { name: 'Python', color: '#22d3ee' },
                  { name: 'FastAPI', color: '#34d399' },
                  { name: 'GitLab CI/CD', color: '#f97316' },
                  { name: 'Docker', color: '#3b82f6' },
                  { name: 'PostgreSQL', color: '#22d3ee' },
                  { name: 'Redis', color: '#f87171' },
                  { name: 'Prometheus', color: '#f97316' },
                  { name: 'Grafana', color: '#f97316' },
                  { name: 'RAG / MCP', color: '#8b5cf6' },
                  { name: 'Helm', color: '#3b82f6' },
                  { name: 'SQS', color: '#f97316' },
                  { name: 'Next.js', color: '#e2e4f0' },
                ].map((t) => (
                  <span key={t.name} className="fx-pill" style={{
                    padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
                    fontFamily: 'JetBrains Mono, monospace', cursor: 'default',
                    color: t.color, background: `${t.color}15`, border: `1px solid ${t.color}30`,
                  }}>{t.name}</span>
                ))}
              </div>
            </div>

          </div>
    </AppShell>
  )
}