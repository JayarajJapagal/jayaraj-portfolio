# Project Setup Log

> This file documents every step followed to set up this project from scratch.
> It is NOT the project documentation — it is a developer log of how this was created.
> Useful if you need to recreate this setup or understand why decisions were made.

---

## Date Started
July 2026

## Project
Personal portfolio website for Jayaraj Japagal — DevOps & Platform Engineer.

---

## Step 1 — GitLab Repository

**Decision:** Monorepo — frontend, backend, infrastructure all in one repo.

```
GitLab → New Project → Create blank project

Name        : jayaraj-portfolio
Visibility  : Public
Description : Personal portfolio — DevOps & Platform Engineer
README      : Yes (initialize with README)
```

**Why monorepo:**
- Frontend (Next.js) and backend (FastAPI) are tightly coupled
- One CI/CD pipeline manages everything
- Easier to share types and config between frontend and backend
- Standard for small projects

---

## Step 2 — Clone Repository

```bash
git clone git@gitlab.com:Jayaraj_1437/jayaraj-portfolio.git
cd jayaraj-portfolio
```

---

## Step 3 — Monorepo Folder Structure

**Decision:** Put Next.js inside `frontend/` not at root level.

```
jayaraj-portfolio/
├── frontend/          ← Next.js app
├── backend/           ← FastAPI (AI chat API) — coming later
├── infrastructure/    ← Terraform — coming later
├── k8s/               ← Kubernetes manifests — coming later
├── README.md
├── SETUP.md
└── .gitlab-ci.yml
```

**Why not at root:**
- Backend API will live alongside frontend in same repo
- Root-level Next.js conflicts with other folders
- Cleaner separation of concerns

---

## Step 4 — Next.js Setup

```bash
mkdir frontend
cd frontend

npx create-next-app@14 . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

**Why Next.js 14 (not 15):**
- Next.js 15 uses Tailwind v4 which has native binding issues on Apple Silicon (ARM64)
- Next.js 14 uses Tailwind v3 — stable, no native module issues
- App Router (not Pages Router) — modern, current standard

**Flags explained:**
```
--typescript        → type safety, catches errors early
--tailwind          → utility-first CSS, fast styling
--eslint            → code quality checks
--app               → App Router (not legacy Pages Router)
--no-src-dir        → files at root of frontend/, not in src/
--import-alias "@/*" → import from "@/components/..." not "../../components/..."
```

---

## Step 5 — Install Additional Dependencies

```bash
cd frontend
npm install framer-motion    # animations
npm install lucide-react     # icons
npm install clsx             # conditional class names
```

**Why each:**
```
framer-motion  → page transitions, skill card animations, terminal boot sequence
lucide-react   → clean consistent icon set (used by Linear, Vercel etc.)
clsx           → utility for combining Tailwind classes conditionally
               → e.g. clsx('base-class', isActive && 'active-class')
```

---

## Step 6 — next.config.mjs (Static Export)

**File:** `frontend/next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',         // generate static HTML files
  trailingSlash: true,      // /about/ not /about (required for S3)
  images: {
    unoptimized: true       // disable Next.js image optimization (not available in static export)
  },
  eslint: {
    ignoreDuringBuilds: true  // don't fail CI on ESLint warnings
  },
  typescript: {
    ignoreBuildErrors: true   // don't fail CI on TypeScript errors during build
  }
}

export default nextConfig
```

**Why `output: 'export'`:**
```
Generates static HTML/CSS/JS files in out/ folder
No Node.js server needed at runtime
Files uploaded to S3 and served as static website
S3 + CloudFront serves them globally
```

**Why `trailingSlash: true`:**
```
Without: /about → S3 looks for file named "about" → 404
With:    /about/ → S3 looks for about/index.html → found ✅
S3 static hosting requires this
```

---

## Step 7 — AWS S3 Bucket

**Decision:** S3 + CloudFront for hosting (not Vercel).

**Why AWS over Vercel:**
- Portfolio showcases AWS skills
- Architecture page shows real AWS diagram
- Backend API will run on same AWS account
- Demonstrates full-stack AWS knowledge to recruiters

**Why not Vercel:**
- Doesn't demonstrate AWS skills
- Every React portfolio looks the same on Vercel

**Create bucket:**

```bash
aws s3 mb s3://jayaraj-portfolio-dev --region eu-central-1
```

**Note:** `jayaraj-portfolio` was already taken (S3 bucket names are globally unique).
Tried: `jayaraj-portfolio` → taken
Used: `jayaraj-portfolio-dev`

**Disable public access block:**
```bash
aws s3api put-public-access-block \
  --bucket jayaraj-portfolio-dev \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

**Why:** AWS blocks all public access by default. Must explicitly unblock to allow public read.

**Enable static website hosting:**
```bash
aws s3 website s3://jayaraj-portfolio-dev \
  --index-document index.html \
  --error-document index.html
```

**Why:** Without this, S3 serves raw files. With this, S3 acts as a web server and serves index.html for root requests. error-document also set to index.html so Next.js client-side routing handles 404s.

**Add public read policy:**
```bash
cat > /tmp/portfolio-bucket-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::jayaraj-portfolio-dev/*"
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket jayaraj-portfolio-dev \
  --policy file:///tmp/portfolio-bucket-policy.json
```

**Why:** Allows anyone on the internet to read/download files. Required for CloudFront to serve them to visitors.

---

## Step 8 — AWS CloudFront Distribution

**Why CloudFront:**
```
S3 static hosting only supports HTTP (not HTTPS)
CloudFront sits in front of S3 and provides:
→ HTTPS (SSL certificate included free)
→ Global CDN (400+ edge locations)
→ Faster for visitors (cached at nearest edge)
→ Custom domain support (when domain is purchased)
```

**Create distribution:**
```bash
cat > /tmp/portfolio-cf.json << 'EOF'
{
  "CallerReference": "jayaraj-portfolio-2026",
  "Comment": "Jayaraj Portfolio",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-jayaraj-portfolio-dev",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "Compress": true
  },
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-jayaraj-portfolio-dev",
      "DomainName": "jayaraj-portfolio-dev.s3-website.eu-central-1.amazonaws.com",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only",
        "OriginSslProtocols": {
          "Quantity": 3,
          "Items": ["TLSv1", "TLSv1.1", "TLSv1.2"]
        },
        "OriginReadTimeout": 30,
        "OriginKeepaliveTimeout": 5
      },
      "CustomHeaders": {"Quantity": 0, "Items": []}
    }]
  },
  "DefaultRootObject": "index.html",
  "Enabled": true,
  "HttpVersion": "http2",
  "PriceClass": "PriceClass_100"
}
EOF

aws cloudfront create-distribution \
  --distribution-config file:///tmp/portfolio-cf.json \
  --query 'Distribution.{ID:Id,Domain:DomainName,Status:Status}' \
  --output table
```

**Result:**
```
CloudFront Domain : d13jalrq1nn418.cloudfront.net
Distribution ID   : E23HVB5ZUXOFRE
Status            : InProgress (takes 10-15 min to deploy globally)
```

**Config explained:**
```
ViewerProtocolPolicy: redirect-to-https
  → HTTP visitors automatically redirected to HTTPS

CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6
  → AWS managed "CachingOptimized" policy
  → caches files at edge for 24h by default

OriginProtocolPolicy: http-only
  → CloudFront talks to S3 over HTTP (S3 website endpoint is HTTP only)
  → CloudFront handles HTTPS for the visitor side

PriceClass_100
  → only uses edge locations in North America and Europe
  → cheaper than global (PriceClass_All)
  → fine for portfolio targeting recruiters in India/Europe

DefaultRootObject: index.html
  → serves index.html when visitor goes to root URL /
```

---

## Step 9 — GitLab CI/CD Pipeline

**File:** `.gitlab-ci.yml` at repo root

```yaml
stages:
  - build
  - deploy

variables:
  AWS_DEFAULT_REGION: eu-central-1
  S3_BUCKET: jayaraj-portfolio-dev
  CF_DISTRIBUTION_ID: E23HVB5ZUXOFRE

build:
  stage: build
  image: node:20-alpine
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - frontend/node_modules/
  script:
    - cd frontend
    - npm install
    - npm run build
  artifacts:
    paths:
      - frontend/out/
    expire_in: 1 hour
  only:
    - main

deploy:
  stage: deploy
  image: amazon/aws-cli:latest
  dependencies:
    - build
  script:
    - aws s3 sync frontend/out/ s3://$S3_BUCKET --delete
    - aws cloudfront create-invalidation
        --distribution-id $CF_DISTRIBUTION_ID
        --paths "/*"
  only:
    - main
```

**Pipeline flow:**
```
git push origin main
      │
      ▼
build job (node:20-alpine):
  cd frontend
  npm install
  npm run build     → generates frontend/out/
      │
      ▼ (artifacts passed to next stage)
deploy job (amazon/aws-cli):
  aws s3 sync frontend/out/ s3://jayaraj-portfolio-dev --delete
  aws cloudfront create-invalidation --paths "/*"
      │
      ▼
Live at https://d13jalrq1nn418.cloudfront.net
```

**Why two stages:**
```
build  → compiles code, produces artifact (out/)
deploy → takes artifact, pushes to AWS
Separation means: if build fails, deploy never runs
```

**`--delete` flag on s3 sync:**
```
Removes files from S3 that no longer exist locally
Prevents stale old files from being served
```

**CloudFront invalidation:**
```
CloudFront caches files at edge for 24h
After deploy, old cache would serve old files
Invalidation tells all edges: "fetch fresh files now"
Costs $0.005 per 1000 paths — essentially free
```

---

## Step 10 — GitLab CI/CD Variables

```
GitLab → jayaraj-portfolio → Settings → CI/CD → Variables

Variable              | Value              | Protected | Masked
─────────────────────────────────────────────────────────────
AWS_ACCESS_KEY_ID     | <your key>         | Yes       | No
AWS_SECRET_ACCESS_KEY | <your secret>      | Yes       | Yes
```

**Why Protected + Masked:**
```
Protected → only runs on protected branches (main)
Masked    → value hidden in CI logs (important for secrets)
```

**IAM permissions needed for CI user:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::jayaraj-portfolio-dev",
        "arn:aws:s3:::jayaraj-portfolio-dev/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "arn:aws:cloudfront::087706154065:distribution/E23HVB5ZUXOFRE"
    }
  ]
}
```

---

## Key Values Reference

```
S3 Bucket Name      : jayaraj-portfolio-dev
S3 Region           : eu-central-1
S3 Website URL      : http://jayaraj-portfolio-dev.s3-website.eu-central-1.amazonaws.com
CloudFront ID       : E23HVB5ZUXOFRE
CloudFront Domain   : d13jalrq1nn418.cloudfront.net
CloudFront URL      : https://d13jalrq1nn418.cloudfront.net
AWS Account         : 087706154065
```

---

## What's Next

```
□ Build portfolio pages (Phase 2)
□ Buy custom domain (jayaraj.dev or jayarajjapagal.com)
□ Connect domain to CloudFront via Route53
□ Add ACM SSL certificate for custom domain
□ Build FastAPI backend for AI chat (Phase 4)
□ Deploy backend to EKS
□ Connect api.jayaraj.dev to backend
```

---

## Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Hosting platform | AWS (S3 + CloudFront) | Showcases AWS skills to recruiters |
| Framework | Next.js 14 (not 15) | Tailwind v3 — no ARM64 native binding issues |
| Repo structure | Monorepo | Frontend + backend + infra in one place |
| Next.js version | 14 | Stable, no Tailwind v4 issues on Mac M-series |
| S3 region | eu-central-1 | Same region as ecommerce platform |
| CloudFront price class | PriceClass_100 | Cheaper, sufficient for India/Europe audience |
| output mode | export | Static files, no Node.js server needed |