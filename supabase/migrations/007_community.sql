-- Community Features Migration
-- Adds public profiles, following system, outfit likes, and comments

-- Add community fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Add public/community fields to outfit_suggestions
ALTER TABLE outfit_suggestions ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE outfit_suggestions ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE outfit_suggestions ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- Following system
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id) -- Can't follow yourself
);

-- Outfit likes
CREATE TABLE IF NOT EXISTS outfit_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_id UUID NOT NULL REFERENCES outfit_suggestions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, outfit_id)
);

-- Outfit comments
CREATE TABLE IF NOT EXISTS outfit_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id UUID NOT NULL REFERENCES outfit_suggestions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows
CREATE POLICY "Users can see all follows"
  ON follows FOR SELECT USING (true);

CREATE POLICY "Users can create their own follows"
  ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows"
  ON follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for outfit_likes
CREATE POLICY "Users can see all likes"
  ON outfit_likes FOR SELECT USING (true);

CREATE POLICY "Users can create their own likes"
  ON outfit_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON outfit_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for outfit_comments
CREATE POLICY "Users can see comments on public outfits"
  ON outfit_comments FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM outfit_suggestions o
      WHERE o.id = outfit_id
      AND (o.is_public = true OR o.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create comments on public outfits"
  ON outfit_comments FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM outfit_suggestions o
      WHERE o.id = outfit_id
      AND o.is_public = true
    )
  );

CREATE POLICY "Users can update their own comments"
  ON outfit_comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON outfit_comments FOR DELETE USING (auth.uid() = user_id);

-- Update profiles RLS to allow viewing public profiles
DROP POLICY IF EXISTS "Users can see their own profile" ON profiles;
CREATE POLICY "Users can see their own or public profiles"
  ON profiles FOR SELECT USING (
    auth.uid() = user_id OR is_public = true
  );

-- Update outfit_suggestions RLS to allow viewing public outfits
DROP POLICY IF EXISTS "Users can see their own outfits" ON outfit_suggestions;
CREATE POLICY "Users can see their own or public outfits"
  ON outfit_suggestions FOR SELECT USING (
    auth.uid() = user_id OR is_public = true
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_outfit_likes_outfit_id ON outfit_likes(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_likes_user_id ON outfit_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_comments_outfit_id ON outfit_comments(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_comments_user_id ON outfit_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON profiles(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_outfit_suggestions_is_public ON outfit_suggestions(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Function to update followers/following counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment follower's following_count
    UPDATE profiles SET following_count = following_count + 1
    WHERE user_id = NEW.follower_id;
    -- Increment following's followers_count
    UPDATE profiles SET followers_count = followers_count + 1
    WHERE user_id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement follower's following_count
    UPDATE profiles SET following_count = GREATEST(following_count - 1, 0)
    WHERE user_id = OLD.follower_id;
    -- Decrement following's followers_count
    UPDATE profiles SET followers_count = GREATEST(followers_count - 1, 0)
    WHERE user_id = OLD.following_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for follow counts
DROP TRIGGER IF EXISTS on_follow_change ON follows;
CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_outfit_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE outfit_suggestions SET likes_count = likes_count + 1
    WHERE id = NEW.outfit_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE outfit_suggestions SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.outfit_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for likes count
DROP TRIGGER IF EXISTS on_like_change ON outfit_likes;
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON outfit_likes
  FOR EACH ROW EXECUTE FUNCTION update_outfit_likes_count();

-- Function to update comments count
CREATE OR REPLACE FUNCTION update_outfit_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE outfit_suggestions SET comments_count = comments_count + 1
    WHERE id = NEW.outfit_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE outfit_suggestions SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.outfit_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for comments count
DROP TRIGGER IF EXISTS on_comment_change ON outfit_comments;
CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON outfit_comments
  FOR EACH ROW EXECUTE FUNCTION update_outfit_comments_count();

-- Trigger to update comments updated_at
DROP TRIGGER IF EXISTS update_outfit_comments_updated_at ON outfit_comments;
CREATE TRIGGER update_outfit_comments_updated_at
  BEFORE UPDATE ON outfit_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
