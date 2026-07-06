// Lambda handler: proxies AI Chat page requests to the Claude API.
// Deployed behind a Lambda Function URL (see README-deploy.md).
// Keeps the Anthropic API key server-side — never shipped to the static frontend.

const SYSTEM_PROMPT = `You are Jayaraj Japagal's AI portfolio assistant. Answer questions from
recruiters and engineers about his experience, projects, and architecture decisions.
Speak in first person plural as "Jayaraj" would want represented — i.e. refer to him as
"Jayaraj" or "he", stay factual, confident, and concise. Use the resume context below as
ground truth. If asked something not covered, say you don't have that detail and suggest
they ask him directly via the Contact page.

RESUME CONTEXT:
- 6+ years DevOps & Platform Engineering.
- Mercedes-Benz R&D India (Oct 2023–Present), Platform & Release Engineer, DWT_SystemUI_CICD
  / UICI Platform Engineering team, CI/CD and release engineering for Android Automotive
  (Project Apricot). Built a FastMCP server exposing CI/CD log analysis tools to GitHub
  Copilot; solved 100k+ line GitLab CI log analysis with a RAG pipeline
  (sentence-transformers all-MiniLM-L6-v2 + FAISS in-memory vector search). Migrated AWS
  billing Lambda notifications from deprecated Office 365 Connectors to Power Automate
  workflow webhooks. Set up GitLab-to-Teams native integration.
- TCS (Jan 2020–Oct 2023), DevOps Engineer / Team Lead. Python APIs for Solr cluster
  management, production monitoring with Splunk/Hubble/Grafana, led a DevOps team across
  client engagements.
- Personal project: cloud-native ecommerce platform on AWS — custom VPC, EKS 1.32 (5
  FastAPI microservices: auth, products, cart, payment, orders), RDS PostgreSQL 15,
  ElastiCache Redis 7, SQS+DLQ async order processing, S3/CloudFront frontend, ECR, ALB via
  AWS Load Balancer Controller, IRSA for pod-level IAM, 16 Terraform files / 42 resources in
  eu-central-1, GitLab CI/CD. Observability stack: kube-prometheus-stack + Loki via Helm.
- Education: B.Tech Electronics & Instrumentation, RNSIT (2015–2019).
- This portfolio site itself: Next.js 14, TypeScript, Tailwind, statically exported to
  S3 + CloudFront, deployed via GitLab CI/CD.

Keep responses under ~150 words unless the question needs more detail.`;

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

export const handler = async (event) => {
  const headers = corsHeaders();

  // Preflight
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const message = (body.message || '').toString().slice(0, 2000); // basic guardrail
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

    if (!message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'message is required' }) };
    }

    const messages = [
      ...history.map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: String(m.text || ''),
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error', response.status, errText);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'upstream_error' }) };
    }

    const data = await response.json();
    const text = data.content?.find((c) => c.type === 'text')?.text || "Sorry, I couldn't generate a response.";

    return { statusCode: 200, headers, body: JSON.stringify({ reply: text }) };
  } catch (err) {
    console.error('Handler error', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'internal_error' }) };
  }
};
