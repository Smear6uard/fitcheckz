-- Add onboarding fields to profiles table
ALTER TABLE profiles
ADD COLUMN style_vibes TEXT[], -- e.g., ['streetwear', 'minimalist', 'y2k']
ADD COLUMN typical_occasions TEXT[], -- e.g., ['casual', 'work', 'date night']
ADD COLUMN age_range TEXT, -- Optional: '18-24', '25-34', '35-44', '45+'
ADD COLUMN gender TEXT, -- Optional: 'male', 'female', 'non-binary', 'prefer not to say'
ADD COLUMN favorite_colors TEXT[], -- e.g., ['black', 'white', 'beige']
ADD COLUMN fashion_goals TEXT[], -- e.g., ['express myself', 'look professional', 'save time']
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN onboarding_completed_at TIMESTAMP;

-- RLS policies already cover these fields (user-only access on profiles table)
