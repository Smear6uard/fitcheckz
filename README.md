# Fitcheckz - AI-Powered Personal Styling App

Get your fit checked. Dress with confidence.

## Features

- **Digital Wardrobe Management**: Upload and organize your clothing items with photos
- **AI Outfit Generation**: Get personalized outfit recommendations powered by OpenAI
- **Style Analytics**: Track your wardrobe statistics and style evolution
- **Subscription Tiers**: Free tier with limits, Pro tier with unlimited features
- **Background Removal**: Automatic background removal for wardrobe photos

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **AI**: OpenAI API
- **Styling**: Tailwind CSS + Shadcn/UI
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Stripe account (for payments)
- remove.bg API key (optional, for background removal)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fitcheckz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file in the root directory
```

Fill in your environment variables (see `SETUP.md` for detailed instructions):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (e.g., `https://ldfnbklxxeqhughckeus.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key (from Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (from Settings → API)
- `OPENAI_API_KEY` - Your OpenAI API key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PRICE_ID` - Your Stripe price ID for Pro tier
- `REMOVE_BG_API_KEY` - Your remove.bg API key (optional)
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., `http://localhost:3000` for dev)

4. Set up Supabase:
   - Your Supabase URL: `https://ldfnbklxxeqhughckeus.supabase.co`
   - Run the migration in `supabase/migrations/001_initial_schema.sql` in SQL Editor
   - Create a storage bucket named `wardrobe` with public access
   - See `SETUP.md` for detailed step-by-step instructions

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fitcheckz/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── common/            # Shared components
│   ├── landing/           # Landing page components
│   ├── outfits/           # Outfit-related components
│   ├── profile/           # Profile components
│   ├── subscription/      # Subscription components
│   ├── ui/                # Shadcn/UI components
│   └── wardrobe/          # Wardrobe components
├── lib/                   # Utility libraries
│   ├── hooks/            # Custom React hooks
│   ├── openai/            # OpenAI integration
│   ├── stripe/            # Stripe integration
│   ├── supabase/          # Supabase clients
│   └── utils/             # Utility functions
├── supabase/              # Supabase migrations
│   └── migrations/
└── types/                 # TypeScript type definitions
```

## Database Schema

The app uses the following main tables:
- `profiles` - User profile information
- `subscriptions` - User subscription data
- `wardrobe_items` - User's wardrobe items
- `outfit_suggestions` - AI-generated outfit suggestions
- `outfit_feedback` - User feedback on outfits
- `feature_usage` - Usage tracking for free tier limits
- `subscription_logs` - Subscription event logs

## Features

### Free Tier
- 5 outfit suggestions per week
- Up to 50 wardrobe items
- View outfit history
- Basic analytics

### Pro Tier ($9.99/month)
- Unlimited outfit suggestions
- Unlimited wardrobe items
- Advanced analytics
- Priority support
- Early access to new features

## Deployment

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## License

MIT
