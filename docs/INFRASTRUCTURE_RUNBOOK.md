# Portfolio Infrastructure Runbook

Documents the work done to add: a real Claude-powered AI Chat, a working Contact
form (email via SES), and a custom domain (`jayaraj.dev`) to the portfolio site.

**AWS Account:** `087706154065`
**Primary region (Lambdas, S3):** `eu-central-1`
**ACM/CloudFront region:** `us-east-1` (CloudFront only accepts certs from here)

---

## Part 1 — Why Lambdas were needed at all

`frontend/next.config.mjs` has `output: 'export'` — the site is a fully static
export, synced to S3 and served by CloudFront. There is no server at request time,
so:
- The Anthropic API key can't live in frontend code (visitors could read it from
  the JS bundle).
- Sending contact-form emails needs *something* server-side to actually send mail.

Both problems were solved the same way: a small AWS Lambda function, given a public
**Function URL**, that the static frontend calls over HTTPS. The Lambda holds the
secret / does the privileged work; the frontend never sees anything sensitive.

---

## Part 2 — Contact Form Lambda (AWS SES)

**Function name:** `jayaraj-portfolio-contact-form`
**IAM role:** `arn:aws:iam::087706154065:role/jayaraj-portfolio-contact-lambda-role`
**Function URL:** `https://qbrxdhstqox2dtevodnmisqdom0iiwjx.lambda-url.eu-central-1.on.aws/`
**Code:** `lambda/contact-form/index.mjs` (uses `@aws-sdk/client-ses`)

### Steps taken

1. **Verified sender email in SES** (required — new SES accounts are in "sandbox
   mode" and can only send to/from verified addresses):
   ```bash
   aws ses verify-email-identity \
     --email-address jayaraj.japagal07@icloud.com \
     --region eu-central-1
   ```
   Confirmed via `aws ses get-identity-verification-attributes`.

2. **Created the IAM role**, attached two permissions:
   - `AWSLambdaBasicExecutionRole` (managed policy — logging)
   - An inline policy granting `ses:SendEmail`

3. **Wrote `index.mjs`**, `npm init -y` + `npm install @aws-sdk/client-ses`,
   zipped with `node_modules` included, and created the function:
   ```bash
   aws lambda create-function \
     --function-name jayaraj-portfolio-contact-form \
     --runtime nodejs20.x \
     --handler index.handler \
     --zip-file fileb://function.zip \
     --role arn:aws:iam::087706154065:role/jayaraj-portfolio-contact-lambda-role \
     --timeout 15 --memory-size 256 --region eu-central-1
   ```

4. **Created a Function URL** with `--auth-type NONE` and CORS restricted to known
   frontend origins, then granted invoke permission.

### Issues hit and fixes

**Issue: `403 Forbidden` on every request, even though the resource policy and
`AuthType: NONE` both looked correct.**
Cause: newer AWS accounts have a "block public access" safety feature that
specifically restricts the `lambda:InvokeFunctionUrl` permission from actually
granting public access, even when explicitly allowed.
Fix: add a *second*, broader permission:
```bash
aws lambda add-permission \
  --function-name jayaraj-portfolio-contact-form \
  --statement-id AllowPublicInvoke \
  --action lambda:InvokeFunction \
  --principal "*" \
  --region eu-central-1
```
This combination (both `InvokeFunctionUrl` and `InvokeFunction` permissions) is
what actually unblocks public access on these newer accounts.

**Issue: browser CORS error —
`Access-Control-Allow-Origin header contains multiple values`.**
Cause: both the Lambda's own code *and* the Function URL's CORS config were each
adding the header, so the browser received it twice.
Fix: removed CORS header logic from the Lambda code entirely; the Function URL's
CORS config is now the single source of truth. (`corsHeaders()` in `index.mjs`
now only returns `Content-Type`.)

**Issue: emails land in the spam folder.**
Cause: sending "from" `jayaraj.japagal07@icloud.com` via SES fails SPF/DKIM
alignment, since SES's servers aren't authorized to send on iCloud's behalf.
Status: **not fixed yet.** Proper fix, now that `jayaraj.dev` is owned: verify the
*domain* in SES (not just the personal email) and send from
`contact@jayaraj.dev` instead, with SES-issued DKIM records added to Route 53.

**Issue (post-domain-launch): CORS error again after `jayaraj.dev` went live.**
Cause: the Function URL's CORS `AllowOrigins` list only had the old CloudFront
URL, not the new domain.
Fix:
```bash
aws lambda update-function-url-config \
  --function-name jayaraj-portfolio-contact-form \
  --cors '{"AllowOrigins":["https://d13jalrq1nn418.cloudfront.net","https://jayaraj.dev","https://www.jayaraj.dev"],"AllowMethods":["POST"],"AllowHeaders":["content-type"]}' \
  --region eu-central-1
```

---

## Part 3 — AI Chat Lambda (Claude API proxy)

**Function name:** `jayaraj-portfolio-claude-chat`
**IAM role:** `arn:aws:iam::087706154065:role/jayaraj-portfolio-chat-lambda-role`
**Function URL:** `https://6bu2usanxtlfxpykqllcogddbm0totzb.lambda-url.eu-central-1.on.aws/`
**Code:** `lambda/claude-chat/index.mjs` (uses built-in `fetch`, no extra
dependencies)

### Steps taken

Same overall pattern as the contact form Lambda, minus SES:

1. IAM role with only `AWSLambdaBasicExecutionRole` attached (no SES permission
   needed — this Lambda just calls `api.anthropic.com`).
2. `index.mjs` written with a system prompt containing Jayaraj's real resume/
   project context, so the model answers grounded in real facts.
3. Function created, same `create-function` pattern as above.
4. **API key stored as a Lambda environment variable:**
   ```bash
   aws lambda update-function-configuration \
     --function-name jayaraj-portfolio-claude-chat \
     --environment "Variables={ANTHROPIC_API_KEY=sk-ant-...}" \
     --region eu-central-1
   ```
5. Function URL created, same two-permission fix applied proactively this time
   (`InvokeFunctionUrl` + `InvokeFunction`) to avoid re-hitting the public-access
   block issue from Part 2.

### Issues hit and fixes

**Issue: `{"error":"upstream_error"}` on every request.**
Diagnosis via CloudWatch Logs:
```bash
aws logs tail /aws/lambda/jayaraj-portfolio-claude-chat --since 5m --region eu-central-1
```
Revealed: `"Your credit balance is too low to access the Anthropic API."` — the
Anthropic Console showed two "Paid" $5.90 credit-grant invoices, but balance still
displayed `$0.00`. Ruled out a workspace mismatch (confirmed only one workspace,
one API key, matching what the Lambda used). Resolved on its own after a short
wait — likely a billing-system propagation delay.

**Issue (post-domain-launch): CORS on the new domain**, same as the contact form.
Fix: same pattern —
```bash
aws lambda update-function-url-config \
  --function-name jayaraj-portfolio-claude-chat \
  --cors '{"AllowOrigins":["https://d13jalrq1nn418.cloudfront.net","https://jayaraj.dev","https://www.jayaraj.dev"],"AllowMethods":["POST"],"AllowHeaders":["content-type"]}' \
  --region eu-central-1
```

### ⚠️ Outstanding — security cleanup needed

An Anthropic API key was pasted in plaintext during setup (in this chat and in
terminal history). It was rotated once already, but **the original key was never
explicitly deleted** from the Anthropic Console. Go to
Settings → API Keys and delete any key you don't recognize as the current one.

### ⚠️ Outstanding — frontend wiring not yet confirmed live

The Lambda itself works (`curl` tests returned real Claude answers), but the live
site was still showing the old local/hardcoded fallback responses as of the last
check. Two things need confirming:
1. `NEXT_PUBLIC_CHAT_API_URL` added to GitLab → Settings → CI/CD → Variables,
   value = the Function URL above.
2. `frontend/app/ai/page.tsx` on `main` actually contains the `getAIResponse`
   function (calls the Lambda, falls back to local responses only if the URL
   is unset or the request fails) — and that this version has been pushed and
   deployed.

---

## Part 4 — Custom Domain (jayaraj.dev)

**Registrar:** GoDaddy
**Route 53 Hosted Zone ID:** `Z03522633G2PKNGO01J63`
**ACM Certificate ARN:** `arn:aws:acm:us-east-1:087706154065:certificate/d8275f22-cf5a-4fe0-a2e0-ac4f22e00346`
**CloudFront Distribution ID:** `E23HVB5ZUXOFRE` (`d13jalrq1nn418.cloudfront.net`)

### Steps taken, in order

1. **Bought `jayaraj.dev` on GoDaddy** (~₹1,522/year with promo). Declined all
   upsells (website builder plans, extra email, domain protection, AI site
   builder) — none were needed.

2. **Created a Route 53 hosted zone:**
   ```bash
   aws route53 create-hosted-zone \
     --name jayaraj.dev \
     --caller-reference jayaraj-dev-$(date +%s)
   ```
   Returned 4 nameservers:
   ```
   ns-1575.awsdns-04.co.uk
   ns-1356.awsdns-41.org
   ns-554.awsdns-05.net
   ns-220.awsdns-27.com
   ```

3. **Pointed GoDaddy's nameservers at Route 53** — in GoDaddy's domain DNS
   settings, replaced the default GoDaddy nameservers with the 4 above. This
   handed authoritative DNS control from GoDaddy to AWS.

4. **Requested an ACM certificate in `us-east-1`** (required region for
   CloudFront):
   ```bash
   aws acm request-certificate \
     --domain-name jayaraj.dev \
     --subject-alternative-names "www.jayaraj.dev" \
     --validation-method DNS \
     --region us-east-1
   ```

5. **Fetched the DNS validation records** ACM generated:
   ```bash
   aws acm describe-certificate \
     --certificate-arn <arn> --region us-east-1
   ```
   Got two CNAME records (one for `jayaraj.dev`, one for `www.jayaraj.dev`) that
   needed to exist in DNS to prove ownership.

6. **Added those CNAME records to the Route 53 hosted zone:**
   ```bash
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z03522633G2PKNGO01J63 \
     --change-batch file:///tmp/acm-validation.json
   ```
   Certificate flipped from `PENDING_VALIDATION` to `ISSUED` within minutes.

7. **Found the CloudFront distribution ID:**
   ```bash
   aws cloudfront list-distributions \
     --query "DistributionList.Items[].{Id:Id, Domain:DomainName}" --output table
   ```

8. **Updated the CloudFront distribution** — fetched full config, edited two
   fields with a small Python script, uploaded it back:
   - `Aliases` → added `jayaraj.dev` and `www.jayaraj.dev`
   - `ViewerCertificate` → pointed at the ACM cert ARN, `SSLSupportMethod:
     sni-only`, `MinimumProtocolVersion: TLSv1.2_2021`
   ```bash
   aws cloudfront update-distribution \
     --id E23HVB5ZUXOFRE \
     --distribution-config file:///tmp/dist-config-updated.json \
     --if-match <ETag>
   ```

9. **Pointed jayaraj.dev's DNS at CloudFront** — added alias A-records in Route
   53 for both `jayaraj.dev` and `www.jayaraj.dev`, targeting
   `d13jalrq1nn418.cloudfront.net`, using CloudFront's fixed universal alias
   hosted zone ID `Z2FDTNDATAQYW2` (same constant for every AWS account/
   CloudFront distribution, not account-specific).

10. **Verified:**
    ```bash
    curl -I https://jayaraj.dev
    ```
    Returned `HTTP/2 200` — fully working.

### Issues hit and fixes

**Issue: GoDaddy's "Let's connect" wizard didn't have the right option.**
GoDaddy's simplified quick-connect flow only offers connecting to GoDaddy's own
products or basic forwarding — not full nameserver delegation. Had to navigate
directly to the domain's DNS/Nameserver management page instead and manually
enter the 4 AWS nameservers.

**Issue: both Lambda Function URLs broke on the new domain.**
See Parts 2 and 3 above — their CORS allowlists needed `https://jayaraj.dev` and
`https://www.jayaraj.dev` added after the domain went live. This is a recurring
pattern worth remembering: **any time a new origin (domain) is added, check every
Lambda Function URL's CORS config**, not just the CloudFront/S3 side.

---

## GitLab CI/CD Variables Reference

These need to exist in **Settings → CI/CD → Variables** for the frontend build to
pick up the Lambda URLs (Next.js inlines `NEXT_PUBLIC_*` vars at build time):

| Key | Value | Status |
|---|---|---|
| `NEXT_PUBLIC_CHAT_API_URL` | `https://6bu2usanxtlfxpykqllcogddbm0totzb.lambda-url.eu-central-1.on.aws/` | ⚠️ Not yet confirmed added |
| `NEXT_PUBLIC_CONTACT_API_URL` | `https://qbrxdhstqox2dtevodnmisqdom0iiwjx.lambda-url.eu-central-1.on.aws/` | ⚠️ Not yet confirmed added |

---

## Full Reference — IDs, ARNs, and URLs

| Item | Value |
|---|---|
| AWS Account ID | `087706154065` |
| S3 bucket | `jayaraj-portfolio-dev` |
| CloudFront Distribution ID | `E23HVB5ZUXOFRE` |
| CloudFront domain | `d13jalrq1nn418.cloudfront.net` |
| Custom domain | `jayaraj.dev` / `www.jayaraj.dev` |
| Route 53 Hosted Zone ID | `Z03522633G2PKNGO01J63` |
| ACM Certificate ARN | `arn:aws:acm:us-east-1:087706154065:certificate/d8275f22-cf5a-4fe0-a2e0-ac4f22e00346` |
| Contact Lambda function name | `jayaraj-portfolio-contact-form` |
| Contact Lambda IAM role | `arn:aws:iam::087706154065:role/jayaraj-portfolio-contact-lambda-role` |
| Contact Lambda Function URL | `https://qbrxdhstqox2dtevodnmisqdom0iiwjx.lambda-url.eu-central-1.on.aws/` |
| Chat Lambda function name | `jayaraj-portfolio-claude-chat` |
| Chat Lambda IAM role | `arn:aws:iam::087706154065:role/jayaraj-portfolio-chat-lambda-role` |
| Chat Lambda Function URL | `https://6bu2usanxtlfxpykqllcogddbm0totzb.lambda-url.eu-central-1.on.aws/` |
| CloudFront's universal alias hosted zone ID (constant, not account-specific) | `Z2FDTNDATAQYW2` |
| SES verified sender | `jayaraj.japagal07@icloud.com` |

---

## Outstanding TODOs

- [ ] Delete the old, exposed Anthropic API key from console.anthropic.com
- [ ] Confirm `NEXT_PUBLIC_CHAT_API_URL` and `NEXT_PUBLIC_CONTACT_API_URL` are
      actually set in GitLab CI/CD variables
- [ ] Confirm `frontend/app/ai/page.tsx` on `main` has the real-API-calling
      version, not the local-fallback-only version
- [ ] Verify `jayaraj.dev` as a domain in SES (not just the personal email) and
      send contact-form emails from `contact@jayaraj.dev` to fix spam-folder
      delivery — add the SES-issued DKIM CNAME records to Route 53
- [ ] Consider AWS's "block public access" quirk (Part 2) if any *future* Lambda
      Function URL returns 403 despite a correct-looking resource policy — the
      fix is always: add both `InvokeFunctionUrl` and `InvokeFunction`
      permissions for principal `*`