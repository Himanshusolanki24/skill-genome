-- Task Completions Table
-- Tracks all completed tasks by users

CREATE TABLE IF NOT EXISTS task_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES daily_tasks(id) ON DELETE SET NULL,
    task_type VARCHAR(50) DEFAULT 'daily',
    technology VARCHAR(50),
    difficulty VARCHAR(20),
    xp_earned INTEGER DEFAULT 10,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_task_completions_user ON task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_date ON task_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_task_completions_tech ON task_completions(technology);

-- Enable Row Level Security
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own task completions
CREATE POLICY "Users can view own task completions"
    ON task_completions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own task completions
CREATE POLICY "Users can insert own task completions"
    ON task_completions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own task completions
CREATE POLICY "Users can update own task completions"
    ON task_completions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own task completions
CREATE POLICY "Users can delete own task completions"
    ON task_completions
    FOR DELETE
    USING (auth.uid() = user_id);
