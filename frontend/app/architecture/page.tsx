'use client'

import AppShell from '@/components/layout/AppShell'
import { useState } from 'react'

type Node = {
  id: string
  label: string
  sublabel?: string
  icon: string
  color: string
  what: string
  built: string[]
  proof: string
  file: string
}

const nodes: Record<string, Node> = {
  user: {
    id: 'user', label: 'User / Browser', sublabel: 'HTTPS', icon: '👤', color: '#60a5fa',
    what: 'Every request starts here — either loading the Next.js frontend or calling one of the 5 backend APIs through the ALB.',
    built: [
      'Static frontend served from CloudFront / S3',
      'API calls routed through the ALB by path',
      'All traffic over HTTPS',
    ],
    proof: 'GET /              → CloudFront → S3 (frontend)\nGET /auth/*        → ALB → auth-service:8001\nGET /products/*    → ALB → products-service:8002\nGET /cart/*        → ALB → cart-service:8004\nGET /payment/*     → ALB → payment-service:8005\nGET /orders/*      → ALB → orders-service:8003',
    file: 'k8/ingress.yaml',
  },
  cloudfront: {
    id: 'cloudfront', label: 'CloudFront', sublabel: 'CDN · HTTPS', icon: '☁', color: '#22d3ee',
    what: 'CDN in front of the S3-hosted static export of the Next.js frontend — edge caching and HTTPS termination.',
    built: [
      'Serves the statically-exported frontend (`next export` → `out/`)',
      'HTTPS everywhere via CloudFront',
      'Provisioned via AWS CLI — frontend hosting sits outside the `infrastructure/` Terraform stack',
    ],
    proof: 'aws s3 sync out/ s3://<frontend-bucket>\naws cloudfront create-invalidation --distribution-id <ID> --paths "/*"',
    file: 'Not in infrastructure/*.tf — created via AWS CLI',
  },
  s3: {
    id: 's3', label: 'S3', sublabel: 'Static frontend', icon: '🪣', color: '#22d3ee',
    what: 'Bucket storing the static Next.js export — origin for the CloudFront distribution.',
    built: [
      "Next.js `output: 'export'` build → static HTML/CSS/JS",
      'No server-side rendering — fully static frontend',
      'Bucket policy restricts direct public access; CloudFront is the only reader',
    ],
    proof: 'aws s3 sync out/ s3://<frontend-bucket>\naws cloudfront create-invalidation --distribution-id <ID> --paths "/*"',
    file: 'Not in infrastructure/*.tf — created via AWS CLI',
  },
  alb: {
    id: 'alb', label: 'ALB', sublabel: 'Path routing', icon: '⚖', color: '#38bdf8',
    what: 'Application Load Balancer, provisioned automatically by the AWS Load Balancer Controller from a single Kubernetes Ingress — path-based routing to all 5 services.',
    built: [
      'aws-load-balancer-controller installed via Helm, using IRSA for AWS API access',
      'One Ingress (`ecommerce-ingress`) with 5 path rules',
      'target-type: ip — routes directly to pod IPs, not node ports',
      'ALB security group allows 80/443 from 0.0.0.0/0 only',
    ],
    proof: 'kubernetes.io/ingress.class: alb\nalb.ingress.kubernetes.io/scheme: internet-facing\nalb.ingress.kubernetes.io/target-type: ip\n\n- path: /auth      → auth-service:8001\n- path: /products  → products-service:8002\n- path: /cart      → cart-service:8004\n- path: /payment   → payment-service:8005\n- path: /orders    → orders-service:8003',
    file: 'k8/ingress.yaml',
  },
  auth: {
    id: 'auth', label: 'auth', sublabel: ':8001', icon: '🔐', color: '#34d399',
    what: 'JWT-based authentication — registration, login, token issuance.',
    built: ['ClusterIP Service on port 8001', 'bcrypt password hashing', '/health endpoint used by the ALB target group health check'],
    proof: 'metadata:\n  name: auth-service\n  annotations:\n    alb.ingress.kubernetes.io/healthcheck-path: /health\nspec:\n  selector: { app: auth }\n  ports: [{ port: 8001, targetPort: 8001 }]',
    file: 'k8/auth-service.yaml, k8/auth-deployment.yaml',
  },
  products: {
    id: 'products', label: 'products', sublabel: ':8002', icon: '📦', color: '#34d399',
    what: 'Product catalog CRUD service.',
    built: ['ClusterIP Service on port 8002', 'SQLAlchemy models backed by RDS PostgreSQL', '/health endpoint for ALB target group checks'],
    proof: 'metadata:\n  name: products-service\nspec:\n  selector: { app: product }\n  ports: [{ port: 8002, targetPort: 8002 }]',
    file: 'k8/products-service.yaml, k8/product-deployment.yaml',
  },
  cart: {
    id: 'cart', label: 'cart', sublabel: ':8004', icon: '🛒', color: '#34d399',
    what: 'Redis-backed shopping cart.',
    built: ['Cart stored as a Redis Hash keyed per user', '7-day TTL, refreshed on every cart write', 'ClusterIP Service on port 8004'],
    proof: 'HSET cart:1 "1" \'{"name":"MacBook","price":1299.99}\'\nEXPIRE cart:1 604800',
    file: 'k8/cart-service.yaml, k8/cart-deployment.yaml',
  },
  payment: {
    id: 'payment', label: 'payment', sublabel: ':8005', icon: '💳', color: '#34d399',
    what: 'Stateless checkout orchestration — validates the cart, simulates payment, then creates the order.',
    built: ['ClusterIP Service on port 8005', 'No persistent state of its own', 'Calls into order-service to finalize the order'],
    proof: '@app.post("/payment/checkout")\n→ validate cart → simulate payment\n→ create order → push to SQS',
    file: 'k8/payment-service.yaml, k8/payment-deployment.yaml',
  },
  orders: {
    id: 'orders', label: 'orders', sublabel: ':8003', icon: '📋', color: '#34d399',
    what: 'Order creation plus async post-processing via SQS.',
    built: [
      'Publishes to order-processing-queue right after order creation',
      'Background thread consumes the queue: email, inventory, invoice, warehouse steps',
      'Idempotency key on each order prevents duplicate processing',
    ],
    proof: 'metadata:\n  name: orders-service\nspec:\n  selector: { app: orders }\n  ports: [{ port: 8003, targetPort: 8003 }]',
    file: 'k8/orders-service.yaml, k8/order-deployment.yaml',
  },
  rds: {
    id: 'rds', label: 'RDS PostgreSQL', sublabel: 'db.t3.micro · pg15', icon: '🗄', color: '#fbbf24',
    what: 'Managed PostgreSQL holding all relational data — users, products, orders.',
    built: [
      'postgres 15, db.t3.micro, 20GB gp2',
      'Sits in the DB subnets (10.0.20.0/24, 10.0.21.0/24) — never internet-accessible',
      'Password pulled from SSM Parameter Store at apply-time, never committed in .tf source',
      'Security group only allows 5432 from EKS worker nodes and the EKS cluster SG',
    ],
    proof: 'resource "aws_db_instance" "main" {\n  engine            = "postgres"\n  engine_version    = "15"\n  instance_class    = "db.t3.micro"\n  allocated_storage = 20\n  password = data.aws_ssm_parameter.db_password.value\n  publicly_accessible = false\n}',
    file: 'infrastructure/rds.tf',
  },
  redis: {
    id: 'redis', label: 'ElastiCache Redis', sublabel: 'cache.t3.micro', icon: '⬢', color: '#fbbf24',
    what: 'ElastiCache Redis backing the shopping cart.',
    built: ['redis 7.1, cache.t3.micro, single node', 'Same DB-subnet tier as RDS', 'Only reachable on 6379 from EKS worker nodes and the EKS cluster SG'],
    proof: 'resource "aws_elasticache_cluster" "main" {\n  engine          = "redis"\n  engine_version  = "7.1"\n  node_type       = "cache.t3.micro"\n  num_cache_nodes = 1\n  port            = 6379\n}',
    file: 'infrastructure/elasticache.tf',
  },
  sqs: {
    id: 'sqs', label: 'SQS + DLQ', sublabel: 'async orders', icon: '📨', color: '#fbbf24',
    what: 'Async order-processing queue with dead-letter handling.',
    built: [
      'order-processing-queue — 30s visibility timeout, 4-day retention',
      'order-processing-dlq — 14-day retention, maxReceiveCount 3',
      'orders-service consumes via 20s long polling in a background thread',
    ],
    proof: 'resource "aws_sqs_queue" "orders" {\n  name = "order-processing-queue"\n  visibility_timeout_seconds = 30\n  redrive_policy = jsonencode({\n    deadLetterTargetArn = aws_sqs_queue.orders_dlq.arn\n    maxReceiveCount     = 3\n  })\n}',
    file: 'infrastructure/sqs.tf',
  },
  terraform: {
    id: 'terraform', label: 'Terraform', sublabel: '16 .tf files', icon: '◈', color: '#a78bfa',
    what: 'The entire AWS stack defined as code — VPC through EKS through data layer — with remote state in S3.',
    built: [
      'VPC, subnets, IGW, NAT, route tables, security groups',
      'EKS cluster + node group + IAM roles',
      'RDS, ElastiCache, SQS',
      'Remote state: S3 bucket ecommerce-terraform-state-jayaraj, eu-central-1',
    ],
    proof: 'terraform {\n  backend "s3" {\n    bucket = "ecommerce-terraform-state-jayaraj"\n    key    = "ecommerce/terraform.tfstate"\n    region = "eu-central-1"\n  }\n}',
    file: 'infrastructure/backend.tf + 15 more',
  },
  iam: {
    id: 'iam', label: 'IAM', sublabel: 'roles · IRSA', icon: '🔑', color: '#a78bfa',
    what: 'IAM roles for the EKS control plane and worker nodes — least-privilege, no long-lived keys on pods.',
    built: [
      'eks-cluster-role → AmazonEKSClusterPolicy',
      'eks-nodegroup-role → WorkerNodePolicy + CNI Policy + ECR ReadOnly',
      'IRSA used for pod-level AWS access (e.g. SQS) instead of static credentials',
    ],
    proof: 'resource "aws_iam_role" "eks_nodes" {\n  assume_role_policy = jsonencode({\n    Statement = [{\n      Principal = { Service = "ec2.amazonaws.com" }\n      Action    = "sts:AssumeRole"\n    }]\n  })\n}',
    file: 'infrastructure/iam.tf',
  },
  sg: {
    id: 'sg', label: 'Security Groups', sublabel: '4 groups', icon: '🛡', color: '#a78bfa',
    what: '4 security groups enforcing least-privilege access between tiers.',
    built: [
      'alb-sg — 80/443 from the internet',
      'eks-nodes-sg — 80/443 from the ALB only, plus all traffic between nodes',
      'rds-sg — 5432 from EKS nodes + EKS cluster SG only',
      'redis-sg — 6379 from EKS nodes + EKS cluster SG only',
    ],
    proof: 'ingress {\n  from_port       = 5432\n  to_port         = 5432\n  protocol        = "tcp"\n  security_groups = [\n    aws_security_group.eks_nodes.id,\n    aws_eks_cluster.main.vpc_config[0].cluster_security_group_id\n  ]\n}',
    file: 'infrastructure/security_groups.tf',
  },
  observability: {
    id: 'observability', label: 'Prometheus · Grafana · Loki', sublabel: 'Helm', icon: '◎', color: '#22d3ee',
    what: 'Observability stack installed into the cluster via Helm.',
    built: [
      'kube-prometheus-stack — cluster/node/pod metrics + pre-built Grafana dashboards',
      'loki-stack + Promtail DaemonSet — centralized log aggregation from every node',
      'Grafana wired to both Prometheus and Loki as datasources',
    ],
    proof: 'helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring\nhelm install loki grafana/loki-stack -n monitoring',
    file: 'Helm releases — cluster add-ons, not raw .tf',
  },
  vpc: {
    id: 'vpc', label: 'VPC Networking', sublabel: '10.0.0.0/16', icon: '🌐', color: '#f97316',
    what: '10.0.0.0/16 VPC spanning 2 AZs (eu-central-1a/b) with 3 subnet tiers.',
    built: [
      'Public: 10.0.1.0/24, 10.0.2.0/24 → IGW (ALB, NAT Gateway)',
      'Private: 10.0.10.0/24, 10.0.11.0/24 → NAT (EKS worker nodes, pods)',
      'DB: 10.0.20.0/24, 10.0.21.0/24 → local only, no internet route (RDS, Redis)',
      '1 Internet Gateway, 1 NAT Gateway, 3 route tables, 4 security groups',
    ],
    proof: 'resource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n}\n\npublic_subnet_cidrs  = ["10.0.1.0/24",  "10.0.2.0/24"]\nprivate_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]\ndb_subnet_cidrs      = ["10.0.20.0/24", "10.0.21.0/24"]',
    file: 'infrastructure/vpc.tf, subnets.tf, variables.tf',
  },
  docker: {
    id: 'docker', label: 'Docker / ECR', sublabel: 'containers', icon: '🐳', color: '#a78bfa',
    what: 'Container builds for all 5 FastAPI services, stored in ECR.',
    built: ['Multi-platform builds (linux/amd64) via docker buildx on Apple Silicon', 'Images pushed to ECR with versioned tags', 'One Dockerfile per service'],
    proof: 'docker buildx build --platform linux/amd64 -t service --load .\ndocker push $ECR_URL/ecommerce/orders:v4',
    file: 'services/*/Dockerfile',
  },
  helm: {
    id: 'helm', label: 'Helm', sublabel: 'k8s packaging', icon: '⛵', color: '#a78bfa',
    what: 'Helm installs the cluster add-ons that aren’t hand-rolled Kubernetes YAML.',
    built: ['aws-load-balancer-controller', 'kube-prometheus-stack (monitoring namespace)', 'loki-stack + Promtail'],
    proof: 'helm install aws-load-balancer-controller eks/aws-load-balancer-controller\nhelm install prometheus prometheus-community/kube-prometheus-stack -n monitoring',
    file: 'Helm releases — cluster add-ons, not raw .tf',
  },
  ssm: {
    id: 'ssm', label: 'SSM Parameter Store', sublabel: 'secrets', icon: '🔒', color: '#a78bfa',
    what: 'Holds secrets like the RDS password so they never live in Terraform source or git.',
    built: ['/ecommerce/db_password fetched via a data source at apply-time', 'SecureString type, encrypted at rest', 'No secrets committed to the repo'],
    proof: 'data "aws_ssm_parameter" "db_password" {\n  name            = "/ecommerce/db_password"\n  with_decryption = true\n}',
    file: 'infrastructure/rds.tf',
  },
  ai_layer: {
    id: 'ai_layer', label: 'AI Layer', sublabel: 'planned', icon: '◆', color: '#22d3ee',
    what: 'Planned AI layer for this platform — bringing the same RAG/MCP approach built at Mercedes-Benz to this infrastructure itself.',
    built: [
      'RAG pipeline over Terraform state + runbooks, using pgvector on the existing RDS instance',
      'MCP server exposing infra Q&A tools to GitHub Copilot / Claude',
      'Ops Copilot — ask questions about the running stack in plain English',
      'Not yet implemented — next milestone after the current AWS stack',
    ],
    proof: 'from sentence_transformers import SentenceTransformer\nimport faiss\nmodel = SentenceTransformer("all-MiniLM-L6-v2")\n# planned: same pattern, pointed at this repo\'s infra + runbooks',
    file: 'planned — not in infrastructure/*.tf yet',
  },
}

function ANode({ id, onClick }: { id: string; onClick: (n: Node) => void }) {
  const n = nodes[id]
  return (
    <div
      onClick={() => onClick(n)}
      className="fx-card"
      style={{
        borderRadius: '9px', padding: '9px 14px', cursor: 'pointer', textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 500,
        background: `${n.color}14`, border: `1px solid ${n.color}40`, color: n.color,
      }}
    >
      <div style={{ fontSize: '11px' }}>{n.icon} {n.label}</div>
      {n.sublabel && <div style={{ fontSize: '9px', opacity: 0.65, marginTop: '2px' }}>{n.sublabel}</div>}
    </div>
  )
}

function Arrow() {
  return <div style={{ textAlign: 'center', color: '#4b5380', fontSize: '15px', margin: '2px 0' }}>↓</div>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '9px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
      {children}
    </div>
  )
}

function SecCard({
  icon, title, desc, badges, delay, onPick,
}: {
  icon: string; title: string; desc: string
  badges: { label: string; id: string }[]
  delay: number
  onPick: (n: Node) => void
}) {
  return (
    <div className="fade-up fx-card" style={{ background: '#1a1d2e', border: '1px solid #252840', borderRadius: '12px', padding: '1.25rem', marginBottom: '0.85rem', animationDelay: `${delay}ms` }}>
      <div style={{ fontSize: '14px', fontWeight: 500, color: '#e2e4f0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon} {title}
      </div>
      <div style={{ fontSize: '13px', color: '#9095c0', lineHeight: 1.6, marginBottom: '12px' }}>{desc}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {badges.map(({ label, id }) => {
          const n = nodes[id]
          return (
            <span
              key={label}
              onClick={() => onPick(n)}
              className="fx-pill"
              style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', padding: '3px 9px', borderRadius: '4px', background: `${n.color}18`, color: n.color, border: `1px solid ${n.color}40`, cursor: 'pointer' }}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default function Architecture() {
  const [selected, setSelected] = useState<Node | null>(null)
  const [open, setOpen] = useState(false)

  function openDrawer(n: Node) {
    setSelected(n)
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
  }
  function closeDrawer() {
    setOpen(false)
    setTimeout(() => setSelected(null), 220)
  }

  return (
    <AppShell>
      <div style={{ width: '100%', maxWidth: '760px' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>// click any component for details</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e4f0', letterSpacing: '-0.5px' }}>Infrastructure<span style={{ color: '#3b82f6' }}>.</span></h1>
          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #f97316, #3b82f6)', borderRadius: '1px', marginTop: '0.5rem' }} />
        </div>

        {/* Diagram */}
        <div className="fade-up" style={{ background: '#1a1d2e', border: '1px solid #252840', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' }}>

          <SectionLabel>internet</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'center' }}><ANode id="user" onClick={openDrawer} /></div>
          <Arrow />

          <SectionLabel>cdn + static hosting</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <ANode id="cloudfront" onClick={openDrawer} />
            <ANode id="s3" onClick={openDrawer} />
          </div>
          <Arrow />

          <SectionLabel>load balancer</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'center' }}><ANode id="alb" onClick={openDrawer} /></div>
          <Arrow />

          <SectionLabel>eks 1.32 — kubernetes cluster</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <ANode id="auth" onClick={openDrawer} />
            <ANode id="products" onClick={openDrawer} />
            <ANode id="cart" onClick={openDrawer} />
            <ANode id="payment" onClick={openDrawer} />
            <ANode id="orders" onClick={openDrawer} />
          </div>
          <Arrow />

          <SectionLabel>data layer — db subnets</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <ANode id="rds" onClick={openDrawer} />
            <ANode id="redis" onClick={openDrawer} />
            <ANode id="sqs" onClick={openDrawer} />
          </div>
          <Arrow />

          <SectionLabel>platform + observability</SectionLabel>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <ANode id="terraform" onClick={openDrawer} />
            <ANode id="iam" onClick={openDrawer} />
            <ANode id="sg" onClick={openDrawer} />
            <ANode id="observability" onClick={openDrawer} />
          </div>
        </div>

        {/* Detail sections */}
        <SecCard
          icon="🌐" title="VPC Networking" delay={80} onPick={openDrawer}
          desc="10.0.0.0/16 across 2 AZs. Public for ALB + NAT, private for EKS nodes, DB for RDS + Redis."
          badges={[
            { label: 'VPC 10.0.0.0/16', id: 'vpc' }, { label: 'Public ×2', id: 'vpc' }, { label: 'Private ×2', id: 'vpc' }, { label: 'DB ×2', id: 'vpc' },
            { label: 'IGW', id: 'vpc' }, { label: 'NAT Gateway', id: 'vpc' }, { label: 'Route Tables ×3', id: 'vpc' }, { label: 'Security Groups ×4', id: 'sg' },
          ]}
        />
        <SecCard
          icon="◈" title="Platform Layer" delay={120} onPick={openDrawer}
          desc="The tooling that turns the AWS stack and the cluster into something repeatable and secure."
          badges={[
            { label: 'Terraform IaC', id: 'terraform' }, { label: 'Docker / ECR', id: 'docker' }, { label: 'ALB + Ingress Controller', id: 'alb' },
            { label: 'IRSA', id: 'iam' }, { label: 'Helm', id: 'helm' }, { label: 'SSM Parameter Store', id: 'ssm' },
          ]}
        />
        <SecCard
          icon="🗄" title="Data & Messaging" delay={160} onPick={openDrawer}
          desc="Everything stateful lives in the DB subnets, reachable only from inside the cluster."
          badges={[
            { label: 'RDS PostgreSQL', id: 'rds' }, { label: 'ElastiCache Redis', id: 'redis' }, { label: 'SQS + DLQ', id: 'sqs' },
          ]}
        />
        <SecCard
          icon="◎" title="Observability" delay={200} onPick={openDrawer}
          desc="Full metrics + logs stack installed into the cluster via Helm."
          badges={[
            { label: 'Prometheus', id: 'observability' }, { label: 'Grafana', id: 'observability' }, { label: 'Loki', id: 'observability' },
          ]}
        />
        <SecCard
          icon="◆" title="AI Layer (in progress)" delay={240} onPick={openDrawer}
          desc="Bringing the Mercedes-Benz RAG/MCP pattern to this platform's own infrastructure."
          badges={[
            { label: 'RAG Pipeline', id: 'ai_layer' }, { label: 'pgvector on RDS', id: 'ai_layer' }, { label: 'MCP Server', id: 'ai_layer' }, { label: 'Ops Copilot', id: 'ai_layer' },
          ]}
        />
      </div>

      {/* DRAWER */}
      {selected && (
        <>
          <div
            onClick={closeDrawer}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, opacity: open ? 1 : 0, transition: 'opacity 0.22s ease' }}
          />
          <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px', background: '#13152a', borderLeft: '1px solid #252840',
            zIndex: 101, overflowY: 'auto', padding: '1.5rem',
            transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.22s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #252840' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e2e4f0', marginBottom: '4px' }}>{selected.icon} {selected.label}</h2>
                <div style={{ fontSize: '11px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace' }}>{selected.file}</div>
              </div>
              <button onClick={closeDrawer} style={{ background: '#252840', border: 'none', color: '#9095c0', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: selected.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>// what it is</div>
              <p style={{ fontSize: '14px', color: '#9095c0', lineHeight: 1.7 }}>{selected.what}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: selected.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>// what I built</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selected.built.map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: selected.color, fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>→</span>
                    <span style={{ fontSize: '13px', color: '#8890b8', lineHeight: 1.6 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: selected.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>// proof</div>
              <div style={{ background: '#0c0e1a', border: '1px solid #252840', borderRadius: '8px', padding: '1rem' }}>
                <code style={{ fontSize: '11px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.9, whiteSpace: 'pre-wrap', display: 'block' }}>{selected.proof}</code>
              </div>
            </div>

            <a href="https://gitlab.com/Jayaraj_1437/ecommerce-system" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: `1px solid ${selected.color}40`, borderRadius: '8px', color: selected.color, fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
              View on GitLab →
            </a>
          </div>
        </>
      )}
    </AppShell>
  )
}
