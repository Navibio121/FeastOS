# FeastOS Production Setup Guide

Follow these steps to transition FeastOS from local development to production.

## 1. Database Configuration
The application currently uses SQLite. For production, transition to **PostgreSQL**.

1.  **Update `prisma/schema.prisma`**:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
2.  **Update `.env`**:
    Change `DATABASE_URL` to your production PostgreSQL connection string.

3.  **Run Migrations**:
    ```bash
    npx prisma migrate deploy
    ```

## 2. Payment Integration (Stripe)
1.  **Get Keys**: Create a Stripe account and get your `Secret Key` and `Publishable Key` from the dashboard.
2.  **Webhook**: Set up a Stripe Webhook pointing to `https://your-domain.com/api/webhooks/stripe`.
3.  **Update `.env`**:
    ```env
    STRIPE_SECRET_KEY="sk_live_..."
    STRIPE_WEBHOOK_SECRET="whsec_..."
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
    ```

## 3. Authentication (NextAuth)
1.  **OAuth**: Register your app on Google Cloud Console and GitHub Developer Settings.
2.  **Update `.env`**:
    ```env
    GOOGLE_CLIENT_ID="..."
    GOOGLE_CLIENT_SECRET="..."
    GITHUB_ID="..."
    GITHUB_SECRET="..."
    NEXTAUTH_URL="https://your-domain.com"
    NEXTAUTH_SECRET="..." # Generate a random string
    ```

## 4. Transactional Emails (Resend)
The app is configured to use Resend or Gmail for order confirmations.
1.  **Update `.env`**:
    ```env
    RESEND_API_KEY="re_..."
    ```

## 5. Deployment
We recommend **Vercel** for the fastest deployment, as it has built-in support for Next.js, Edge functions, and optimized images.

---
*Created by Antigravity AI for FeastOS Elite Dining.*
