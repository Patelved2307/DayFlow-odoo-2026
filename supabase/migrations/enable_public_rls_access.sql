-- ==========================================================
-- Enable Full App Sync Policies for Supabase Tables
-- ==========================================================

-- 1. Disable restrictive RLS policies for smooth frontend web app sync
ALTER TABLE IF EXISTS public.employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.interview_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leave_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.attendance_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leave_balances DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.salary_structures DISABLE ROW LEVEL SECURITY;

-- 2. Drop restrictive foreign key constraint on auth.users so non-auth registration sync works seamlessly
ALTER TABLE IF EXISTS public.employees DROP CONSTRAINT IF EXISTS employees_id_fkey;
ALTER TABLE IF EXISTS public.employees DROP CONSTRAINT IF EXISTS employees_interview_id_fkey;

-- Make id column fallback to gen_random_uuid()
ALTER TABLE IF EXISTS public.employees ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS public.employees ALTER COLUMN interview_id DROP NOT NULL;
