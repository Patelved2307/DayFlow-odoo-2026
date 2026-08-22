# ⚡ Supabase Database Setup & Linking Guide

This guide walks you through linking your **Supabase PostgreSQL Database** to the DayFlow / NexaWork platform.

---

## 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and name your project `NexaWork-HRMS`.
3. Set your Database Password and choose your preferred region.

---

## 2. Execute SQL Migrations
1. Open your Supabase Dashboard and click on the **SQL Editor** tab on the left navigation bar.
2. Click **New Query**.
3. Copy and paste the contents of `supabase/migrations/00001_core_schema.sql` into the editor and click **Run**.
4. Create a second query, paste the contents of `supabase/migrations/00002_recruitment_schema.sql`, and click **Run**.
   - *This creates the `interview_profiles` recruitment table, regex candidate ID format constraints, and the `trg_new_employee_init` database trigger that auto-initializes default leave balances (15 Paid, 10 Sick, 5 Unpaid) and salary profile upon registration.*
5. Optionally, run `supabase/migrations/seed_data.sql` to populate sample candidates and workforce records.

---

## 3. Link Credentials to your Environment (`.env`)
1. In your Supabase project dashboard, go to **Project Settings** -> **API**.
2. Copy the **Project URL** and **`anon` `public` Key**.
3. Open or create `.env` in the root of your project directory and add:

```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

---

## 4. Test Local Connection
Start your development server:
```bash
npm run dev
```
The application will automatically detect your Supabase credentials via `src/lib/supabaseClient.ts` and connect directly to your remote Postgres database!
