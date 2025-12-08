-- Gamification system migration
-- Adds streaks, achievements, and style scores

-- User streaks table
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  streak_start_date DATE,
  total_active_days INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Style scores history table
CREATE TABLE IF NOT EXISTS style_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL,
  breakdown JSONB NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_streaks
CREATE POLICY "Users can see their own streaks"
  ON user_streaks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can see their own achievements"
  ON user_achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON user_achievements FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for style_scores
CREATE POLICY "Users can see their own style scores"
  ON style_scores FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own style scores"
  ON style_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_style_scores_user_id ON style_scores(user_id);
CREATE INDEX idx_style_scores_calculated_at ON style_scores(calculated_at DESC);

-- Function to update streak on activity
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INT;
  v_longest_streak INT;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Get current streak data
  SELECT last_activity_date, current_streak, longest_streak
  INTO v_last_activity, v_current_streak, v_longest_streak
  FROM user_streaks
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    -- Create new streak record
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_start_date, total_active_days)
    VALUES (p_user_id, 1, 1, v_today, v_today, 1);
  ELSE
    IF v_last_activity = v_today THEN
      -- Already logged activity today, do nothing
      RETURN;
    ELSIF v_last_activity = v_today - 1 THEN
      -- Consecutive day, increment streak
      UPDATE user_streaks
      SET
        current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_activity_date = v_today,
        total_active_days = total_active_days + 1,
        updated_at = NOW()
      WHERE user_id = p_user_id;
    ELSE
      -- Streak broken, reset to 1
      UPDATE user_streaks
      SET
        current_streak = 1,
        last_activity_date = v_today,
        streak_start_date = v_today,
        total_active_days = total_active_days + 1,
        updated_at = NOW()
      WHERE user_id = p_user_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to update streak on wardrobe item insert
CREATE OR REPLACE FUNCTION trigger_update_streak_on_wardrobe()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_user_streak(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to update streak on outfit generation
CREATE OR REPLACE FUNCTION trigger_update_streak_on_outfit()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_user_streak(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS update_streak_on_wardrobe_insert ON wardrobe_items;
CREATE TRIGGER update_streak_on_wardrobe_insert
  AFTER INSERT ON wardrobe_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_streak_on_wardrobe();

DROP TRIGGER IF EXISTS update_streak_on_outfit_insert ON outfit_suggestions;
CREATE TRIGGER update_streak_on_outfit_insert
  AFTER INSERT ON outfit_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_streak_on_outfit();
