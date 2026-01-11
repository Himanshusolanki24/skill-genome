-- Daily Tasks Question Bank
-- Contains practice questions for each technology and difficulty level

CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    technology VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    question TEXT NOT NULL,
    hint TEXT,
    expected_time_minutes INTEGER DEFAULT 15,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_tasks_tech ON daily_tasks(technology);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_difficulty ON daily_tasks(difficulty);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_tech_diff ON daily_tasks(technology, difficulty);

-- User Completed Tasks table
CREATE TABLE IF NOT EXISTS user_completed_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    task_id UUID NOT NULL REFERENCES daily_tasks(id),
    xp_earned INTEGER DEFAULT 10,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_completed_tasks_user ON user_completed_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_tasks_date ON user_completed_tasks(completed_at);
