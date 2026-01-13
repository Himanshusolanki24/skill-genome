-- Row Level Security (RLS) Policies for All Tables
-- Run this in Supabase SQL Editor to fix security warnings

-- ============================================
-- 1. USERS TABLE
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. DAILY_TASKS TABLE (read-only for all authenticated users)
-- ============================================
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view tasks
DROP POLICY IF EXISTS "Authenticated users can view tasks" ON daily_tasks;
CREATE POLICY "Authenticated users can view tasks" ON daily_tasks
    FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- 3. USER_COMPLETED_TASKS TABLE
-- ============================================
ALTER TABLE user_completed_tasks ENABLE ROW LEVEL SECURITY;

-- Users can view their own completed tasks
DROP POLICY IF EXISTS "Users can view own completed tasks" ON user_completed_tasks;
CREATE POLICY "Users can view own completed tasks" ON user_completed_tasks
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own completed tasks
DROP POLICY IF EXISTS "Users can insert own completed tasks" ON user_completed_tasks;
CREATE POLICY "Users can insert own completed tasks" ON user_completed_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. USER_STREAKS TABLE
-- ============================================
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Users can view their own streaks
DROP POLICY IF EXISTS "Users can view own streaks" ON user_streaks;
CREATE POLICY "Users can view own streaks" ON user_streaks
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own streaks
DROP POLICY IF EXISTS "Users can insert own streaks" ON user_streaks;
CREATE POLICY "Users can insert own streaks" ON user_streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own streaks
DROP POLICY IF EXISTS "Users can update own streaks" ON user_streaks;
CREATE POLICY "Users can update own streaks" ON user_streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 5. USER_ACTIVITY_LOG TABLE
-- ============================================
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity log
DROP POLICY IF EXISTS "Users can view own activity log" ON user_activity_log;
CREATE POLICY "Users can view own activity log" ON user_activity_log
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own activity log
DROP POLICY IF EXISTS "Users can insert own activity log" ON user_activity_log;
CREATE POLICY "Users can insert own activity log" ON user_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 6. FIX FUNCTION SEARCH PATH
-- ============================================
-- Update handle_new_user function with SET search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url, provider, profile_completed)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'given_name' || ' ' || NEW.raw_user_meta_data->>'family_name',
            ''
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            ''
        ),
        COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
        FALSE
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, users.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        provider = EXCLUDED.provider,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'RLS policies enabled on all tables!' as message;
