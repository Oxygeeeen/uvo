import { Resend } from 'resend';

type EmailKind = 'verify' | 'verified' | 'reset';

const productName = 'Nigeria Oil Value Command Center';
const from =
  process.env.EMAIL_FROM ??
  'Nigeria Oil Value Office <hello@scaleworkagency.com>';
const adminEmail = process.env.ADMIN_EMAIL ?? 'hello@scaleworkagency.com';

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] ?? character,
  );
}

function emailDocument({
  kind,
  name,
  actionUrl,
}: {
  kind: EmailKind;
  name: string;
  actionUrl?: string;
}) {
  const firstName = escapeHtml(name.trim().split(/\s+/)[0] || 'there');
  const copy = {
    verify: {
      eyebrow: 'IDENTITY VERIFICATION',
      title: 'Confirm your enterprise access',
      body: `Hello ${firstName}, verify this email address to activate your secure decision workspace.`,
      button: 'Verify and continue',
      footnote: 'This link expires in 60 minutes and can only be used once.',
    },
    verified: {
      eyebrow: 'ACCESS CONFIRMED',
      title: 'Your account is ready',
      body: `Hello ${firstName}, your email has been verified. You can now access the production, value exposure, recovery and assurance workspaces.`,
      button: 'Open command center',
      footnote:
        'Security alerts and account preferences can be managed from Account information.',
    },
    reset: {
      eyebrow: 'SECURE ACCOUNT RECOVERY',
      title: 'Reset your password',
      body: `Hello ${firstName}, use the secure link below to choose a new password.`,
      button: 'Reset password',
      footnote: 'If you did not request this, no action is required.',
    },
  }[kind];

  const button = actionUrl
    ? `<a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:#0b5d54;color:#fff;text-decoration:none;padding:14px 22px;border-radius:10px;font-size:14px;font-weight:700">${copy.button}</a>`
    : '';

  return `<!doctype html>
  <html><body style="margin:0;background:#f3f4ef;font-family:Arial,sans-serif;color:#17302e">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;background:#f3f4ef"><tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border:1px solid #e1e5df;border-radius:18px;overflow:hidden">
        <tr><td style="padding:26px 32px;background:#073b3a;color:#fff">
          <table role="presentation"><tr><td style="width:42px;height:42px;border-radius:12px;background:#e3bb68;text-align:center;vertical-align:middle;font-weight:800;color:#17302e">NV</td><td style="padding-left:14px"><div style="font-size:15px;font-weight:700">Upstream Value Office</div><div style="font-size:12px;color:#b7d5ce;margin-top:3px">Nigeria portfolio · secure workspace</div></td></tr></table>
        </td></tr>
        <tr><td style="padding:38px 32px 32px">
          <div style="font-size:11px;letter-spacing:1.6px;font-weight:700;color:#987329">${copy.eyebrow}</div>
          <h1 style="font-size:27px;line-height:1.25;margin:13px 0 14px;color:#17302e">${copy.title}</h1>
          <p style="font-size:15px;line-height:1.7;color:#536360;margin:0 0 26px">${copy.body}</p>
          ${button}
          <p style="font-size:12px;line-height:1.6;color:#7d8986;margin:28px 0 0">${copy.footnote}</p>
        </td></tr>
        <tr><td style="border-top:1px solid #e7e9e4;padding:20px 32px;font-size:11px;line-height:1.6;color:#89918e">
          ${productName}<br>Administrative support: ${adminEmail}
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

async function send({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`RESEND_API_KEY is missing; skipped email to ${to}.`);
    }
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from, to, subject, html, text });
  if (error) throw new Error(error.message);
}

export async function sendVerificationEmail(input: {
  email: string;
  name: string;
  url: string;
}) {
  if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== 'production') {
    console.info(
      `Development verification link for ${input.email}: ${input.url}`,
    );
  }
  await send({
    to: input.email,
    subject: 'Verify your Nigeria Oil Value account',
    html: emailDocument({
      kind: 'verify',
      name: input.name,
      actionUrl: input.url,
    }),
    text: `Verify your account: ${input.url}. This link expires in 60 minutes.`,
  });
}

export async function sendVerifiedEmail(input: {
  email: string;
  name: string;
  dashboardUrl: string;
}) {
  await send({
    to: input.email,
    subject: 'Your enterprise access is confirmed',
    html: emailDocument({
      kind: 'verified',
      name: input.name,
      actionUrl: input.dashboardUrl,
    }),
    text: `Your email is verified. Open the command center: ${input.dashboardUrl}`,
  });
}

export async function sendPasswordResetEmail(input: {
  email: string;
  name: string;
  url: string;
}) {
  if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== 'production') {
    console.info(
      `Development password reset link for ${input.email}: ${input.url}`,
    );
  }
  await send({
    to: input.email,
    subject: 'Reset your Nigeria Oil Value password',
    html: emailDocument({
      kind: 'reset',
      name: input.name,
      actionUrl: input.url,
    }),
    text: `Reset your password: ${input.url}`,
  });
}
