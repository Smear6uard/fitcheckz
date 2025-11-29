-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  profile_photo_url TEXT,
  body_type TEXT CHECK (body_type IN ('petite', 'standard', 'tall', 'plus-size')),
  height_cm INTEGER,
  budget_range TEXT CHECK (budget_range IN ('budget', 'mid', 'luxury')),
  skin_tone TEXT CHECK (skin_tone IN ('fair', 'light', 'medium', 'deep')),
  aesthetic_preference TEXT CHECK (aesthetic_preference IN ('minimalist', 'trendy', 'classic', 'edgy')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wardrobe items table
CREATE TABLE wardrobe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('top', 'bottom', 'dress', 'jacket', 'shoes', 'accessories', 'outerwear')),
  primary_color TEXT,
  secondary_colors TEXT[],
  fabric_type TEXT,
  brand TEXT,
  size TEXT,
  cost DECIMAL(10, 2),
  purchase_date DATE,
  seasons TEXT[],
  occasions TEXT[],
  condition TEXT CHECK (condition IN ('new', 'excellent', 'good', 'worn')),
  custom_tags TEXT[],
  last_worn TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outfit suggestions table
CREATE TABLE outfit_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wardrobe_item_ids UUID[] NOT NULL,
  occasion TEXT,
  season TEXT,
  mood TEXT,
  ai_explanation TEXT,
  risk_level INTEGER CHECK (risk_level >= 1 AND risk_level <= 5),
  liked BOOLEAN DEFAULT FALSE,
  worn BOOLEAN DEFAULT FALSE,
  worn_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  suggested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outfit feedback table
CREATE TABLE outfit_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_id UUID NOT NULL REFERENCES outfit_suggestions(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  actually_worn BOOLEAN DEFAULT FALSE,
  compliments INTEGER DEFAULT 0,
  comfort_level INTEGER CHECK (comfort_level >= 1 AND comfort_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription logs table
CREATE TABLE subscription_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('subscription_created', 'upgraded', 'downgraded', 'canceled', 'payment_failed')),
  from_tier TEXT,
  to_tier TEXT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature usage table
CREATE TABLE feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  outfit_suggestions_count INTEGER DEFAULT 0,
  wardrobe_items_count INTEGER DEFAULT 0,
  outfits_saved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can see their own profile"
  ON profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can see their own subscription"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for wardrobe_items
CREATE POLICY "Users can only see their own items"
  ON wardrobe_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own items"
  ON wardrobe_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON wardrobe_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON wardrobe_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for outfit_suggestions
CREATE POLICY "Users can see their own outfits"
  ON outfit_suggestions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outfits"
  ON outfit_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits"
  ON outfit_suggestions FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for outfit_feedback
CREATE POLICY "Users can see their own feedback"
  ON outfit_feedback FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback"
  ON outfit_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscription_logs
CREATE POLICY "Users can see their own logs"
  ON subscription_logs FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for feature_usage
CREATE POLICY "Users can see their own usage"
  ON feature_usage FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own usage"
  ON feature_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON feature_usage FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_items_category ON wardrobe_items(category);
CREATE INDEX idx_wardrobe_items_created_at ON wardrobe_items(created_at);
CREATE INDEX idx_outfit_suggestions_user_id ON outfit_suggestions(user_id);
CREATE INDEX idx_outfit_suggestions_created_at ON outfit_suggestions(created_at);
CREATE INDEX idx_outfit_feedback_user_id ON outfit_feedback(user_id);
CREATE INDEX idx_outfit_feedback_outfit_id ON outfit_feedback(outfit_id);
CREATE INDEX idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX idx_feature_usage_week_start ON feature_usage(week_start);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wardrobe_items_updated_at BEFORE UPDATE ON wardrobe_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)));
  
  INSERT INTO public.subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

