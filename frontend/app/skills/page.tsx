'use client'

import AppShell from '@/components/layout/AppShell'
import { useState } from 'react'

const skills = [
  {
    category: 'Cloud & Infrastructure',
    color: '#f97316',
    items: [
      { name: 'AWS', icon: '☁', badge: 'prod', level: 'Advanced', used: 'Personal Project · Mercedes-Benz', what: 'Amazon Web Services — primary cloud provider.', built: ['EKS, ECR, RDS, ElastiCache, SQS, S3, CloudFront, ALB, VPC, IAM, SSM in production', 'Full VPC with 6 subnets across 2 AZs, IGW, NAT Gateway, security groups', 'EKS cluster with managed node groups and IRSA', 'RDS PostgreSQL + ElastiCache Redis + SQS in private subnets', 'SSM Parameter Store for secrets — never hardcoded'], proof: 'aws eks update-kubeconfig --name ecommerce-eks\nterraform output rds_endpoint\naws ssm get-parameter --name /ecommerce/db_password' },
      { name: 'VPC Networking', icon: '🌐', badge: null, level: 'Advanced', used: 'Personal Project', what: 'Designed complete AWS VPC with subnet tiers, routing, NAT, and security groups from scratch.', built: ['10.0.0.0/16 VPC with public, private, and DB subnet tiers', 'Internet Gateway for public, NAT Gateway for private outbound', '3 route tables, 4 security groups with least-privilege rules', 'EKS subnet tags for ALB auto-discovery'], proof: 'VPC: 10.0.0.0/16\nPublic:  10.0.1-2.0/24  → IGW\nPrivate: 10.0.10-11.0/24 → NAT\nDB:      10.0.20-21.0/24 → local' },
    ],
  },
  {
    category: 'Container Orchestration',
    color: '#3b82f6',
    items: [
      { name: 'Kubernetes / EKS', icon: '☸', badge: 'live', level: 'Advanced', used: 'Personal Project', what: 'Deployed and managed production microservices on AWS EKS.', built: ['EKS 1.32 cluster with 2 managed t3.small nodes', '5 microservice Deployments with ClusterIP Services', 'AWS Load Balancer Controller for path-based ALB ingress', 'Helm: kube-prometheus-stack, loki-stack, aws-load-balancer-controller', 'IRSA for SQS access — no hardcoded AWS credentials'], proof: 'kubectl get pods\nauth      1/1 Running\ncart      1/1 Running\norders    1/1 Running\npayment   1/1 Running\nproducts  1/1 Running' },
      { name: 'Docker', icon: '🐳', badge: null, level: 'Advanced', used: 'Personal Project · TCS', what: 'Containerized all 5 FastAPI microservices. Multi-platform builds on Apple Silicon.', built: ['Dockerfiles for all 5 FastAPI services', 'Multi-platform: --platform linux/amd64 for EKS x86_64', 'Images stored in AWS ECR with versioned tags', 'docker buildx for cross-platform builds on M-series Mac'], proof: 'docker buildx build --platform linux/amd64 -t service --load .\ndocker push $ECR_URL/ecommerce/orders:v4' },
    ],
  },
  {
    category: 'Infrastructure as Code',
    color: '#8b5cf6',
    items: [
      { name: 'Terraform', icon: '◈', badge: '16 files', level: 'Advanced', used: 'Personal Project', what: '16 Terraform files managing entire AWS infrastructure. Remote state in S3.', built: ['vpc.tf, subnets.tf, igw.tf, nat.tf, route_tables.tf, security_groups.tf', 'eks.tf, node_group.tf, iam.tf (IRSA roles)', 'rds.tf, elasticache.tf, sqs.tf', 'Remote state backend in S3 with versioning', 'Secrets in SSM — never in .tf files'], proof: 'terraform apply\nPlan: 42 to add, 0 to change, 0 to destroy\nApply complete! Resources: 42 added.' },
    ],
  },
  {
    category: 'Backend & APIs',
    color: '#34d399',
    items: [
      { name: 'Python', icon: '⬡', badge: '6yr', level: 'Expert', used: 'Mercedes-Benz · TCS · Personal Project', what: '6+ years as primary language. APIs, automation, data pipelines, AI/RAG systems.', built: ['5 FastAPI microservices on EKS', 'MCP server at Mercedes-Benz for GitHub Copilot integration', 'RAG pipeline with sentence-transformers and FAISS', 'CI/CD automation scripts at Mercedes-Benz', 'Solr management APIs at TCS'], proof: 'from fastapi import FastAPI\nfrom sentence_transformers import SentenceTransformer\nimport boto3' },
      { name: 'FastAPI', icon: '⚡', badge: null, level: 'Advanced', used: 'Personal Project', what: 'Built 5 production microservices with SQLAlchemy, Pydantic, CORS, background threads.', built: ['auth-service: JWT + bcrypt, user registration and login', 'cart-service: Redis-backed cart with TTL', 'payment-service: stateless checkout orchestration', 'order-service: SQS async processing with background thread'], proof: '@app.post("/payment/checkout")\n→ validate cart → simulate payment\n→ create order → push to SQS' },
      { name: 'PostgreSQL', icon: '🗃', badge: null, level: 'Advanced', used: 'Mercedes-Benz · Personal Project', what: 'RDS PostgreSQL 15 in production. SQLAlchemy ORM, idempotency keys, analytics at Mercedes-Benz.', built: ['RDS PostgreSQL 15 on db.t3.micro in private DB subnet', 'SQLAlchemy models for users, products, orders', 'Idempotency keys on orders to prevent duplicate processing', 'CI/CD analytics platform at Mercedes-Benz across Gerrit, GitLab, Jira'], proof: 'CREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  idempotency_key VARCHAR UNIQUE,\n  status VARCHAR\n)' },
      { name: 'Redis', icon: '⬢', badge: null, level: 'Intermediate', used: 'Personal Project', what: 'ElastiCache Redis for shopping cart. Hash structure per user, 7-day TTL.', built: ['Cart data as Redis Hash: HSET cart:1 product_id json', '7-day TTL resets on every cart interaction', 'ElastiCache Redis 7 on cache.t3.micro in private subnet'], proof: 'HSET cart:1 "1" \'{"name":"MacBook","price":1299.99}\'\nEXPIRE cart:1 604800' },
    ],
  },
  {
    category: 'DevOps & CI/CD',
    color: '#f97316',
    items: [
      { name: 'GitLab CI/CD', icon: '⬡', badge: 'mercedes', level: 'Expert', used: 'Mercedes-Benz · Personal Project', what: 'Automotive-scale CI/CD at Mercedes-Benz. Personal project pipeline for Docker build + S3 deploy.', built: ['CI/CD intelligence platform for Android Automotive at Mercedes-Benz', 'Duplicate pipeline cancellation and release workflow automation', 'Docker build + ECR push + EKS deploy pipeline', 'S3 sync + CloudFront invalidation pipeline for portfolio'], proof: 'stages: [build, deploy]\nimage: node:20-alpine\naws s3 sync out/ s3://jayaraj-portfolio-dev' },
      { name: 'AWS SQS', icon: '⚡', badge: null, level: 'Intermediate', used: 'Personal Project', what: 'Async order processing. Standard queue + DLQ. Long polling. IRSA for secure access.', built: ['order-processing-queue + order-processing-dlq (maxReceiveCount=3)', 'Long polling (20s) to reduce empty responses', 'Background thread consumer in order-service', 'Idempotency keys prevent duplicate processing'], proof: 'sqs.receive_message(WaitTimeSeconds=20)\n# process email, inventory, invoice\nsqs.delete_message(ReceiptHandle=...)' },
    ],
  },
  {
    category: 'Observability',
    color: '#22d3ee',
    items: [
      { name: 'Prometheus + Grafana', icon: '◎', badge: null, level: 'Intermediate', used: 'Mercedes-Benz · Personal Project', what: 'kube-prometheus-stack on EKS. Pre-built K8s dashboards. Pipeline health dashboards at Mercedes-Benz.', built: ['kube-prometheus-stack via Helm on EKS monitoring namespace', 'Node exporter + kube-state-metrics for cluster metrics', 'Pre-built dashboards: Cluster, Node, Pod, Networking', 'Grafana dashboards for CI/CD pipeline health at Mercedes-Benz'], proof: 'helm install prometheus prometheus-community/kube-prometheus-stack\n--namespace monitoring' },
      { name: 'Loki + Promtail', icon: '◉', badge: null, level: 'Intermediate', used: 'Personal Project', what: 'Centralized log aggregation via loki-stack Helm chart. Promtail DaemonSet ships logs from all nodes.', built: ['loki-stack v2.9.11 via Helm in monitoring namespace', 'Promtail DaemonSet on both EKS nodes', 'Connected to Grafana as datasource for log querying'], proof: '{namespace="default"} |= "ERROR"\n# search all service logs in Grafana' },
    ],
  },
  {
    category: 'AI & Automation',
    color: '#a78bfa',
    items: [
      { name: 'RAG / MCP', icon: '◆', badge: 'AI', level: 'Intermediate', used: 'Mercedes-Benz', what: 'MCP server + RAG pipeline for CI/CD log analysis via GitHub Copilot at Mercedes-Benz.', built: ['MCP server exposing CI/CD log search tools to GitHub Copilot', 'RAG pipeline: chunk logs → embed → FAISS index', 'all-MiniLM-L6-v2 model for embedding CI/CD log chunks', 'AI-assisted release letter generation system'], proof: 'from sentence_transformers import SentenceTransformer\nimport faiss\nmodel = SentenceTransformer("all-MiniLM-L6-v2")' },
    ],
  },
]

type SkillItem = typeof skills[0]['items'][0] & { catColor: string }

const levelFill: Record<string, number> = { Expert: 5, Advanced: 4, Intermediate: 3 }
const levelAbbr: Record<string, string> = { Expert: 'EXP', Advanced: 'ADV', Intermediate: 'INT' }

function SkillMeter({ level, color }: { level: string; color: string }) {
  const filled = levelFill[level] ?? 3
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: '12px', height: '3px', borderRadius: '3px', background: i < filled ? color : '#252840' }} />
      ))}
    </span>
  )
}

export default function Skills() {
  const [selected, setSelected] = useState<SkillItem | null>(null)

  return (
    <AppShell>
          <div style={{ width: '100%', maxWidth: '720px' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>// click any card for details</div>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e4f0', letterSpacing: '-0.5px' }}>Skills<span style={{ color: '#3b82f6' }}>.</span></h1>
              <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #f97316, #3b82f6)', borderRadius: '1px', marginTop: '0.5rem' }} />
            </div>

            {/* Card grid */}
            <div className="fade-up" style={{ background: 'linear-gradient(180deg, #2b3459 0%, #262e4f 100%)', border: '1px solid #3a4374', borderRadius: '12px', padding: '1.5rem', animationDelay: '60ms' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {skills.flatMap((cat) => cat.items.map((skill) => ({ skill, cat }))).map(({ skill, cat }, i) => (
                <div
                  key={skill.name}
                  onClick={() => setSelected({ ...skill, catColor: cat.color })}
                  className="fx-card fade-up"
                  style={{
                    background: '#1a1d2e', border: '1px solid #252840',
                    borderRadius: '12px', padding: '1.25rem 1rem',
                    cursor: 'pointer', textAlign: 'center',
                    position: 'relative',
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  {skill.badge && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: cat.color, background: `${cat.color}15`, border: `1px solid ${cat.color}30`, padding: '1px 6px', borderRadius: '3px' }}>{skill.badge}</div>
                  )}
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{skill.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e4f0', marginBottom: '4px' }}>{skill.name}</div>
                  <div style={{ fontSize: '10px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace' }}>{cat.category.toLowerCase()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                    <SkillMeter level={skill.level} color={cat.color} />
                    <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: cat.color, background: `${cat.color}18`, padding: '1px 5px', borderRadius: '3px', letterSpacing: '0.5px' }}>{levelAbbr[skill.level] ?? skill.level}</span>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

      {/* MODAL DRAWER */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
          <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px', background: '#13152a', borderLeft: '1px solid #252840', zIndex: 101, overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #252840' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#e2e4f0', marginBottom: '4px' }}>{selected.name}</h2>
                <div style={{ fontSize: '11px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace' }}>{selected.used}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: '#252840', border: 'none', color: '#9095c0', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: selected.catColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>// what is this</div>
              <p style={{ fontSize: '14px', color: '#9095c0', lineHeight: 1.7 }}>{selected.what}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: selected.catColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>// what I built</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selected.built.map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: selected.catColor, fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>→</span>
                    <span style={{ fontSize: '13px', color: '#8890b8', lineHeight: 1.6 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: selected.catColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>// proof</div>
              <div style={{ background: '#0c0e1a', border: '1px solid #252840', borderRadius: '8px', padding: '1rem' }}>
                <code style={{ fontSize: '11px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.9, whiteSpace: 'pre-wrap', display: 'block' }}>{selected.proof}</code>
              </div>
            </div>

            <a href="https://gitlab.com/Jayaraj_1437/ecommerce-system" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: `1px solid ${selected.catColor}40`, borderRadius: '8px', color: selected.catColor, fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
              View on GitLab →
            </a>
          </div>
        </>
      )}
    </AppShell>
  )
}
