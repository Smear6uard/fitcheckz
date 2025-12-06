-- Add visualization fields to outfit_suggestions table
ALTER TABLE outfit_suggestions
ADD COLUMN visualization_url TEXT,
ADD COLUMN visualization_status TEXT CHECK (visualization_status IN ('pending', 'processing', 'completed', 'failed')),
ADD COLUMN visualization_prompt TEXT,
ADD COLUMN replicate_prediction_id TEXT;

-- Create index for efficient prediction ID lookups
CREATE INDEX idx_outfit_suggestions_prediction_id ON outfit_suggestions(replicate_prediction_id);

-- Add visualizations counter to feature_usage table
ALTER TABLE feature_usage ADD COLUMN visualizations_generated INTEGER DEFAULT 0;
