-- Interview Results Table
-- Stores user interview performance data for dashboard analytics

CREATE TABLE IF NOT EXISTS interview_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    skill VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    difficulty_level VARCHAR(20) DEFAULT 'intermediate',
    interview_date TIMESTAMPTZ DEFAULT NOW(),
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_interview_results_user_id ON interview_results(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_results_date ON interview_results(interview_date);

-- Enable RLS
ALTER TABLE interview_results ENABLE ROW LEVEL SECURITY;

-- Users can only see their own interview results
CREATE POLICY "Users can view own interview results"
    ON interview_results FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own interview results
CREATE POLICY "Users can insert own interview results"
    ON interview_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User Activity Table for streak tracking
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    activity_type VARCHAR(50) NOT NULL, -- 'interview', 'task', 'login'
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one entry per user per date per activity type
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity_unique 
    ON user_activity(user_id, activity_date, activity_type);

-- Index for streak calculation
CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity(user_id, activity_date);

-- Enable RLS
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Users can only see their own activity
CREATE POLICY "Users can view own activity"
    ON user_activity FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity"
    ON user_activity FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add streak and XP columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity_date DATE;
