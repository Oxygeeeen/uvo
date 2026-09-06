import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

import { db } from '@/lib/db';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendVerifiedEmail,
} from '@/lib/email';

const baseUrl =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const auth = betterAuth({
  appName: 'Nigeria Oil Value Command Center',
  database: db,
  baseURL: baseUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ].filter(Boolean) as string[],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    async sendResetPassword({ user, url }) {
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    async sendVerificationEmail({ user, url }) {
      await sendVerificationEmail({
        email: user.email,
        name: user.name,
        url,
      });
    },
    async afterEmailVerification(user) {
      await sendVerifiedEmail({
        email: user.email,
        name: user.name,
        dashboardUrl: `${baseUrl ?? 'http://localhost:3000'}/verified`,
      });
    },
  },
  user: {
    additionalFields: {
      jobTitle: {
        type: 'string',
        required: false,
        defaultValue: 'Energy professional',
        input: true,
      },
      businessUnit: {
        type: 'string',
        required: false,
        defaultValue: 'Nigeria Upstream',
        input: true,
      },
      location: {
        type: 'string',
        required: false,
        defaultValue: 'Lagos, Nigeria',
        input: true,
      },
      timezone: {
        type: 'string',
        required: false,
        defaultValue: 'Africa/Lagos',
        input: true,
      },
      weeklyBrief: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        input: true,
      },
      securityAlerts: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        input: true,
      },
      disruptionAlerts: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        input: true,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'Analyst',
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          const adminEmail = (
            process.env.ADMIN_EMAIL ?? 'hello@scaleworkagency.com'
          ).toLowerCase();
          return {
            data: {
              ...user,
              role:
                String(user.email).toLowerCase() === adminEmail
                  ? 'Administrator'
                  : 'Analyst',
            },
          };
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 8,
    updateAge: 60 * 30,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
