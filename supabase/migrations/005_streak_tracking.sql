-- Add streak tracking fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_date DATE,
ADD COLUMN IF NOT EXISTS total_days_active INTEGER DEFAULT 0;

-- Index for efficient streak queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_active_date ON profiles(last_active_date);

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS void AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  last_active DATE;
  current_streak_count INTEGER;
BEGIN
  -- Get last active date
  SELECT last_active_date INTO last_active
  FROM profiles
  WHERE user_id = user_uuid;

  -- If no last active date or it's a new day
  IF last_active IS NULL OR last_active < today_date THEN
    -- Check if it's consecutive (yesterday)
    IF last_active IS NULL OR last_active = today_date - INTERVAL '1 day' THEN
      -- Increment streak
      UPDATE profiles
      SET 
        current_streak = COALESCE(current_streak, 0) + 1,
        longest_streak = GREATEST(longest_streak, COALESCE(current_streak, 0) + 1),
        last_active_date = today_date,
        total_days_active = COALESCE(total_days_active, 0) + 1
      WHERE user_id = user_uuid;
    ELSE
      -- Reset streak (not consecutive)
      UPDATE profiles
      SET 
        current_streak = 1,
        last_active_date = today_date,
        total_days_active = COALESCE(total_days_active, 0) + 1
      WHERE user_id = user_uuid;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

