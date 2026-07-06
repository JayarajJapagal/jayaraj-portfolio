// Lambda handler: receives Contact page form submissions and emails them via SES.
// Deployed behind its own Lambda Function URL (see README-deploy.md).

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'eu-central-1' });

const NOTIFY_EMAIL = 'jayaraj.japagal07@icloud.com'; // where you receive submissions
const FROM_EMAIL = 'jayaraj.japagal07@icloud.com';   // must be SES-verified (see README)

const ALLOWED_ORIGINS = [
  'https://d13jalrq1nn418.cloudfront.net',
  'https://jayaraj.dev',
  'http://localhost:3000',
];

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const headers = corsHeaders(origin);

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const name = (body.name || '').toString().slice(0, 200);
    const company = (body.company || '').toString().slice(0, 200);
    const email = (body.email || '').toString().slice(0, 200);
    const role = (body.role || '').toString().slice(0, 200);
    const message = (body.message || '').toString().slice(0, 5000);

    if (!name || !email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'name and email are required' }) };
    }

    // very basic email shape check — real validation happens when you reply
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid email' }) };
    }

    const textBody = `New portfolio contact form submission

Name: ${name}
Company: ${company || '—'}
Email: ${email}
Role hiring for: ${role || '—'}

Message:
${message || '—'}`;

    const htmlBody = `<h2>New portfolio contact form submission</h2>
<p><b>Name:</b> ${escapeHtml(name)}<br/>
<b>Company:</b> ${escapeHtml(company || '—')}<br/>
<b>Email:</b> ${escapeHtml(email)}<br/>
<b>Role hiring for:</b> ${escapeHtml(role || '—')}</p>
<p><b>Message:</b><br/>${escapeHtml(message || '—').replace(/\n/g, '<br/>')}</p>`;

    await ses.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [NOTIFY_EMAIL] },
      ReplyToAddresses: [email],
      Message: {
        Subject: { Data: `Portfolio contact: ${name}${company ? ' · ' + company : ''}` },
        Body: {
          Text: { Data: textBody },
          Html: { Data: htmlBody },
        },
      },
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Contact form handler error', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'internal_error' }) };
  }
};
