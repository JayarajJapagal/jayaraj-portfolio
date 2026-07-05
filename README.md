# Jayaraj Japagal — Portfolio
 
> DevOps & Platform Engineer · AWS · Kubernetes · Python · AI · Bengaluru, India
 
[![Live](https://img.shields.io/badge/Live-jayaraj.vercel.app-6366f1?style=flat-square)](https://jayaraj.vercel.app)
[![GitLab](https://img.shields.io/badge/GitLab-Jayaraj__1437-orange?style=flat-square&logo=gitlab)](https://gitlab.com/Jayaraj_1437)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
 
---
 
## Overview
 
Personal portfolio and engineering showcase built to demonstrate real-world cloud architecture, DevOps practices, and AI-powered engineering — not just list technologies on a resume.
 
The site itself is an engineering decision:
 
- **Frontend** hosted on Vercel (right tool for Next.js static/SSR)
- **Backend API** hosted on AWS EKS (demonstrates Kubernetes, Terraform, IAM)
- **AI chatbot** powered by Claude API with RAG over my actual resume and project docs
---
 
## Live
 
| | URL |
|---|---|
| Portfolio | https://jayaraj.vercel.app |
| Backend API | https://api.jayaraj.dev *(coming soon)* |
| Ecommerce Project | https://gitlab.com/Jayaraj_1437/ecommerce-system |
 
---
 
## Tech Stack
 
### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 | React framework, App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Page transitions + animations |
| React Flow | Interactive architecture diagram |
| Lucide React | Icons |
 
### Backend (AI)
| Technology | Purpose |
|---|---|
| FastAPI (Python) | REST API for AI chat |
| Claude API (Anthropic) | AI responses |
| RAG Pipeline | Context-aware answers from resume + project docs |
| pgvector on RDS | Vector embeddings storage |
| sentence-transformers | Document embedding |
 
### Infrastructure
| Technology | Purpose |
|---|---|
| AWS EKS | Kubernetes cluster for backend |
| AWS RDS PostgreSQL | Database + pgvector |
| AWS ElastiCache Redis | Caching |
| AWS S3 | Asset storage |
| AWS Route53 | DNS management |
| AWS ALB | Load balancing |
| Terraform | Infrastructure as Code |
| GitLab CI/CD | Continuous deployment |
| Vercel | Frontend hosting + CDN |
 
---
 
## Project Structure
 
```
jayaraj-portfolio/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (sidebar + topbar)
│   ├── page.tsx                # About page
│   ├── experience/
│   │   └── page.tsx            # Career timeline
│   ├── projects/
│   │   └── page.tsx            # Project showcase
│   ├── architecture/
│   │   └── page.tsx            # Interactive AWS diagram
│   ├── skills/
│   │   └── page.tsx            # Skills dashboard
│   ├── blog/
│   │   └── page.tsx            # Learning notes
│   ├── ai/
│   │   └── page.tsx            # AI chat assistant
│   └── contact/
│       └── page.tsx            # Contact form
│
├── components/                 # Reusable UI components
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── Topbar.tsx          # Top bar with clock + status
│   ├── ui/
│   │   ├── Drawer.tsx          # Slide-out detail panel
│   │   ├── SkillCard.tsx       # Clickable skill card
│   │   ├── Tag.tsx             # Colored tag/badge
│   │   └── Terminal.tsx        # Terminal UI component
│   └── sections/
│       ├── ArchDiagram.tsx     # React Flow architecture diagram
│       ├── Timeline.tsx        # Experience timeline
│       └── AIChat.tsx          # Chat interface
│
├── lib/                        # Utilities and data
│   ├── data/
│   │   ├── experience.ts       # Career history data
│   │   ├── skills.ts           # Skills data
│   │   ├── projects.ts         # Project details
│   │   └── architecture.ts     # Architecture node data
│   └── api.ts                  # API client functions
│
├── public/                     # Static assets
│   ├── resume.pdf              # Downloadable resume
│   └── og-image.png            # Social preview image
│
├── .gitlab-ci.yml              # GitLab CI/CD pipeline
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── .env.example                # Environment variable template
```
 
---
 
## Pages
 
### About
Personal story, career direction, live system status indicators, recent pipeline activity.
 
### Experience
Interactive timeline split into two tabs:
- **Organisations** — Mercedes-Benz R&D India, TCS
- **Education** — RNSIT B.Tech, AWS certifications
### Projects
- **Cloud-Native E-Commerce Platform** — 5 FastAPI microservices on AWS EKS, Terraform IaC, Redis cart, SQS async processing, Next.js frontend
- **MCP-Based CI/CD Intelligence** — RAG pipeline + MCP server for GitHub Copilot at Mercedes-Benz
### Architecture
Interactive AWS architecture diagram built with React Flow.  
Click any component (VPC, EKS, RDS, Redis, SQS, CloudFront...) to open a detail drawer showing what it does, why I chose it, and proof via code snippets.
 
### Skills
14 skill cards — AWS, EKS, Terraform, Docker, GitLab CI/CD, Python, FastAPI, PostgreSQL, Redis, SQS, Prometheus/Grafana, Loki, RAG/MCP, Helm.  
Each card is clickable and opens a drawer with what I built using that skill.
 
### AI Chat
Ask anything about Jayaraj. Powered by Claude API with a RAG pipeline over my resume, project documentation, and architecture decisions.
 
### Contact
Direct links (email, phone, GitLab, LinkedIn) + message form.
 
---
 
## Architecture
 
```
                        Internet
                            │
                    jayaraj.vercel.app
                            │
                    ┌───────────────┐
                    │    Vercel     │
                    │   (Next.js)   │
                    └───────┬───────┘
                            │ HTTPS API calls
                            │
                    api.jayaraj.dev
                            │
                        Route53
                            │
                           ALB
                            │
                          EKS
                    ┌───────┴────────┐
                    │                │
               portfolio-api      ai-api
               (FastAPI)          (FastAPI + RAG)
                    │                │
            ┌───────┴────────┐       │
            │                │       │
      RDS PostgreSQL    ElastiCache  S3
        + pgvector         Redis
```
 
---
 
## Getting Started
 
### Prerequisites
```bash
node >= 18
npm >= 9
```
 
### Local Development
```bash
# Clone
git clone https://gitlab.com/Jayaraj_1437/jayaraj-portfolio.git
cd jayaraj-portfolio
 
# Install
npm install
 
# Environment
cp .env.example .env.local
# Add your Claude API key to .env.local
 
# Run
npm run dev
```
 
Open [http://localhost:3000](http://localhost:3000)
 
### Environment Variables
```bash
# .env.example
NEXT_PUBLIC_API_URL=http://localhost:8000   # Backend API URL
CLAUDE_API_KEY=                             # Anthropic API key (server-side only)
NEXT_PUBLIC_APP_URL=http://localhost:3000   # Frontend URL
```
 
---
 
## Deployment
 
### Frontend (Vercel)
```bash
# Automatic — push to main triggers deployment
git push origin main
 
# Manual
npx vercel --prod
```
 
### Backend (AWS EKS)
```bash
# Build and push Docker image
docker buildx build --platform linux/amd64 -t portfolio-api --load .
docker push $ECR_URL/portfolio-api:latest
 
# Deploy to EKS
kubectl apply -f k8s/
```
 
### Infrastructure (Terraform)
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```
 
---
 
## CI/CD
 
GitLab CI/CD pipeline (`.gitlab-ci.yml`):
 
```
push to main
      │
      ├── lint + type check
      ├── build Next.js
      ├── deploy to Vercel (frontend)
      └── build + push Docker image
          └── deploy to EKS (backend)
```
 
---
 
## Related Projects
 
| Project | Description |
|---|---|
| [ecommerce-system](https://gitlab.com/Jayaraj_1437/ecommerce-system) | Cloud-native ecommerce platform on AWS (5 microservices, EKS, Terraform, SQS, Prometheus) |
 
---
 
## Author
 
**Jayaraj Japagal**  
DevOps & Platform Engineer  
Bengaluru, India
 
- Email: jayaraj.japagal07@icloud.com
- Phone: 8197985949
- GitLab: [gitlab.com/Jayaraj_1437](https://gitlab.com/Jayaraj_1437)
- LinkedIn: [linkedin.com/in/jayaraj-japagal](https://linkedin.com/in/jayaraj-japagal)
---
 
## License
 
MIT — feel free to use this as inspiration for your own portfolio.