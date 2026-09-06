# Nigeria Oil Value Command Center

A standalone, public-web, login-gated enterprise dashboard for Nigerian oil production performance, production forecasting, revenue exposure, recovery prioritisation and global benchmarking.

The project is ready to push to your own GitHub account and deploy to your own Vercel account. It does not depend on ChatGPT Sites authentication or hosting.

## What is included

- Dedicated executive overview, production, value exposure, recovery portfolio, global benchmark, assumptions, source register and account information screens
- Email/password authentication with 12-character minimum passwords, verified-email access gating and eight-hour sessions
- Branded Resend verification, account-confirmation and password-reset emails
- PostgreSQL-backed accounts, sessions and enterprise preferences
- Real-time profile photo updates backed by Vercel Blob
- Account profile, organisation, notification and password settings
- Interactive executive notifications and sign-out controls
- An executive brief modal plus a secure, generated PDF download
- Optimistic edge-route protection plus authoritative server session checks on protected APIs

## Technology

- Next.js 16 App Router
- React 19 and Tailwind CSS 4
- Better Auth with PostgreSQL
- Resend transactional email
- Vercel Blob profile-photo storage
- `pdf-lib` server-side executive brief generation

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Provide a PostgreSQL database URL and apply [database/auth-schema.sql](database/auth-schema.sql). You can paste this file into the Neon SQL editor or run:

   ```bash
   psql "$DATABASE_URL" -f database/auth-schema.sql
   ```

4. Generate a strong authentication secret:

   ```bash
   openssl rand -base64 32
   ```

5. Start the application:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`. Anonymous visitors are redirected to `/login` and can create a verified account at `/signup`.

## Resend configuration

1. Create your Resend account.
2. Add and verify the `scaleworkagency.com` domain in Resend.
3. Create a production API key and set `RESEND_API_KEY` in Vercel.
4. Keep `EMAIL_FROM` as `Nigeria Oil Value Office <hello@scaleworkagency.com>` or change only the display name.
5. Keep `ADMIN_EMAIL=hello@scaleworkagency.com`. An account registered with this exact address receives the `Administrator` role; other accounts receive the `Analyst` role.

Without `RESEND_API_KEY`, local development skips delivery and prints the verification or password-reset URL in the server console for testing. Production should always provide the key.

## Deploy to your Vercel account

1. Create a new private or public GitHub repository and push this project.
2. Import the repository into Vercel with the detected Next.js framework preset.
3. Create or connect a PostgreSQL provider such as Neon, then add `DATABASE_URL`.
4. Create a Vercel Blob store and connect it to the project. Vercel supplies `BLOB_READ_WRITE_TOKEN`.
5. Add every variable from `.env.example` under Project Settings → Environment Variables.
6. Set `BETTER_AUTH_URL` to the final production origin, for example `https://your-domain.com`.
7. Apply `database/auth-schema.sql` to the production database before the first signup.
8. Deploy, then register `hello@scaleworkagency.com` first if that address should be the administrator account.

For preview deployments, use the preview origin as `BETTER_AUTH_URL` or test authentication on the production domain. Better Auth validates origins and callback destinations.

## Environment variables

| Variable                | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `BETTER_AUTH_URL`       | Canonical public application origin                                |
| `BETTER_AUTH_SECRET`    | Signs and protects authentication state; use 32+ random characters |
| `DATABASE_URL`          | PostgreSQL connection string                                       |
| `RESEND_API_KEY`        | Sends verification, confirmation and recovery emails               |
| `EMAIL_FROM`            | Verified sender identity; defaults to `hello@scaleworkagency.com`  |
| `ADMIN_EMAIL`           | Address granted the application administrator role                 |
| `BLOB_READ_WRITE_TOKEN` | Stores public profile images in Vercel Blob                        |

For local profile-photo uploads, connect the project to a public Vercel Blob store and run `vercel env pull .env.local`. A token copied from a deleted or disconnected store must be replaced with the current connected-store token.

Never commit `.env.local`, API keys, database credentials or production secrets. The repository ignores these files.

## Verification commands

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Analytical guardrail

The dashboard uses public and illustrative data for executive decision support. Public production declines cannot establish whether theft, maintenance, evacuation constraints, measurement effects or reservoir performance caused a decline. Validate causal evidence, ownership and net economics before sanctioning a recovery action.
