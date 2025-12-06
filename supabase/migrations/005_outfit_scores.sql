-- Add scoring columns to outfit_suggestions table
ALTER TABLE outfit_suggestions
ADD COLUMN IF NOT EXISTS scores JSONB,
ADD COLUMN IF NOT EXISTS overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100);

-- Add index for filtering by score
CREATE INDEX IF NOT EXISTS idx_outfit_suggestions_overall_score ON outfit_suggestions(overall_score DESC);

-- Add comment for documentation
COMMENT ON COLUMN outfit_suggestions.scores IS 'JSON object containing individual scores: colorHarmony, occasionFit, styleConsistency, seasonality, formality';
COMMENT ON COLUMN outfit_suggestions.overall_score IS 'Overall outfit compatibility score from 0-100';
