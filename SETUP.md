# Fitcheckz Setup Guide

## Quick Start

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ldfnbklxxeqhughckeus.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PRICE_ID=your_stripe_price_id_for_pro_tier

# Remove.bg Configuration (Optional)
REMOVE_BG_API_KEY=your_remove_bg_api_key

# App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get Your Supabase Keys

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/ldfnbklxxeqhughckeus
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL**: `https://ldfnbklxxeqhughckeus.supabase.co` (already provided)
   - **anon/public key**: Copy this to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: Copy this to `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run it in the SQL Editor
4. Verify all tables were created by checking **Table Editor**

### 4. Set Up Storage

1. In Supabase dashboard, go to **Storage**
2. Click **Create bucket**
3. Name it: `wardrobe`
4. Set it to **Public bucket**
5. Create the bucket

### 5. Set Up Stripe (Optional, for payments)

1. Create a Stripe account at https://stripe.com
2. Get your API keys from **Developers** → **API keys**
3. Create a product and price for "Pro" tier ($9.99/month)
4. Copy the Price ID to `NEXT_PUBLIC_STRIPE_PRICE_ID`
5. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - For local testing, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### 6. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to `OPENAI_API_KEY`

### 7. Get remove.bg API Key (Optional)

1. Sign up at https://www.remove.bg/api
2. Get your API key
3. Copy it to `REMOVE_BG_API_KEY`

### 8. Run the Application

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Setup

1. **Test Authentication**:
   - Go to `/signup` and create an account
   - Check Supabase **Authentication** → **Users** to see your user
   - Check **Table Editor** → **profiles** to see your profile was created

2. **Test Wardrobe**:
   - Go to `/wardrobe/upload`
   - Upload a test image
   - Check Supabase **Storage** → **wardrobe** bucket to see the uploaded file

3. **Test Outfit Generation**:
   - Add at least 2 items to your wardrobe
   - Go to `/outfits`
   - Generate an outfit
   - Check that it appears in your history

## Troubleshooting

### "Unauthorized" errors
- Check that your Supabase keys are correct
- Verify RLS policies are enabled on all tables
- Check that the user is authenticated

### Image upload fails
- Verify the `wardrobe` storage bucket exists and is public
- Check that RLS policies allow uploads for authenticated users

### OpenAI errors
- Verify your API key is correct
- Check you have credits in your OpenAI account
- Ensure the model `gpt-4o-mini` is available

### Stripe webhook errors
- For local development, use Stripe CLI
- For production, ensure webhook URL is correct and signature verification is working

