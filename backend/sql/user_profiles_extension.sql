-- User Profile Extension Schema
-- Run this in Supabase SQL Editor after the initial users_table.sql

-- 1. Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS institute_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS course VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS specialization VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS short_bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMP WITH TIME ZONE;

-- 2. Create index for profile completion lookups
CREATE INDEX IF NOT EXISTS idx_users_profile_completed ON users(profile_completed);

-- 3. Update the handle_new_user function to include profile_completed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'User profile extension columns added!' as message;
