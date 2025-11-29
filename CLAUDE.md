# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Run production server
```

## Architecture

This is a Next.js 16 App Router application with React 19 for an AI-powered outfit recommendation service.

### Route Groups
- `app/(auth)/` - Public auth pages (login, signup, reset-password)
- `app/(dashboard)/` - Protected pages requiring authentication (wardrobe, outfits, analytics, profile, subscription)
- `app/api/` - API routes

### Key Integrations

**Supabase** - Database and auth
- `lib/supabase/client.ts` - Browser client (use in Client Components)
- `lib/supabase/server.ts` - Server client (use in Server Components/API routes, async)
- `lib/supabase/queries.ts` - Shared database queries

**OpenAI** - Outfit generation
- `lib/openai/client.ts` - OpenAI client
- `lib/openai/prompts.ts` - Prompt templates for outfit suggestions

**Stripe** - Subscriptions (free tier has limits, pro tier is $9.99/month)
- `lib/stripe/client.ts` - Stripe client
- Webhook at `app/api/stripe/webhook/route.ts`

### Component Organization
- `components/ui/` - Shadcn/UI primitives (new-york style, uses Radix + Tailwind)
- `components/auth/` - Login, signup, password reset forms
- `components/wardrobe/` - Item cards, upload, filters, grid
- `components/outfits/` - Generator, viewer, feedback
- `components/subscription/` - Pricing cards, upgrade prompts

### Custom Hooks (`lib/hooks/`)
- `useUser` - Current user session
- `useWardrobe` - Wardrobe CRUD operations
- `useOutfits` - Outfit suggestions and history
- `useSubscription` - Subscription status and limits

### Database Tables
Main tables: `profiles`, `subscriptions`, `wardrobe_items`, `outfit_suggestions`, `outfit_feedback`, `feature_usage`. All have RLS policies enforcing user-only access. Schema in `supabase/migrations/001_initial_schema.sql`.

### Type Definitions
Types are in `types/` directory: `user.ts`, `wardrobe.ts`, `outfits.ts`, `database.ts`.

## Path Aliases

Uses `@/*` alias mapped to project root (e.g., `@/components`, `@/lib`).

## Styling

Tailwind CSS v4 with shadcn/ui (new-york style). CSS variables for theming defined in `app/globals.css`. Use `sonner` for toast notifications.

## Environment Variables

Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`. Optional: `REMOVE_BG_API_KEY`.
