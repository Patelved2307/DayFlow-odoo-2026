# ⚡ Supabase Production Database Setup & Migration Guide

This guide walks you through deploying the production database architecture for DayFlow / NexaWork on Supabase, featuring Row-Level Security (RLS) policies, automated triggers, candidate interview validation gates, and dynamic payroll views.

---

## 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and name your project `NexaWork-HRMS`.
3. Set a secure Database Password and select your hosting region.

---

## 2. Execute Production SQL Migration
1. Open your Supabase Dashboard and navigate to the **SQL Editor** tab on the left sidebar.
2. Click **New Query**.
3. Copy and paste the entire contents of `supabase/migrations/production_schema.sql` (or `supabase/migrations/00001_core_schema.sql`).
4. Click **Run**.

### Key Architecture Components Deployed:
- **ENUM Types**: `user_role`, `attendance_status`, `leave_type`, `leave_status`, `interview_status`.
- **Database Recruitment Gate (`handle_supabase_new_user`)**: A `SECURITY DEFINER` trigger intercepting `auth.users` signups to validate candidate IDs against `interview_profiles` (enforcing `status = 'Approved'` and regex format `COEDELKOLH00508`).
- **Automatic Employee Initialization (`handle_new_employee_init`)**: Automatically sets up default leave balances (15 Paid, 10 Sick, 5 Unpaid) and salary profile upon account creation.
- **Automated Payroll View (`employee_payroll`)**: Performs real-time math for HRA (15%), DA (5%), Travel (10%), Special (10%), PF (12%), Professional Tax, and Net Salary.
- **Row-Level Security (RLS)**: Enforces RBAC permissions with helper `is_admin()` so employees can only access their own profiles, logs, and leave ledgers.

---

## 3. Link Environment Variables (`.env`)
In your local project root directory, add your Supabase credentials to `.env`:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

---

## 4. Test Local Connection
Run your Vite local dev server:
```bash
npm run dev
```
The application will automatically detect your Supabase URL via `src/lib/supabaseClient.ts` and communicate with your remote Postgres database!
