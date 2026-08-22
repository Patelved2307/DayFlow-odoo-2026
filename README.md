# NexaWork / DayFlow — Enterprise Workforce Alignment Suite

Every workday, **perfectly aligned.**

NexaWork is a next-generation workforce alignment and HR management platform built with React, Vite, TypeScript, Express, Nodemailer, and Supabase.

---

## 🌟 Key Features

1. **Exact Reference Dashboard UI**:
   - 3-Column Layout with clean cards & dark green accents (`#006837`).
   - Topbar search input (`Search task`, `⌘F`), notification buttons, user profile.
   - 4 Stat Cards: `Total Projects` (24, primary dark green card), `Ended Projects` (10), `Running Projects` (12), `Pending Project` (2).
   - `Project Analytics` weekly bar chart with hatched inactive day bars & Wednesday `74%` popover tooltip.
   - `Reminders` meeting card ("Meeting with Arc Company", `Start Meeting` button).
   - `Project` list with colored category icons and due dates.
   - `Team Collaboration` roster with status tags (`Completed`, `In Progress`, `Pending`).
   - `Project Progress` 41% arc gauge & `Time Tracker` dark green wavy widget (`01:24:08`).
   - Sidebar featuring official NexaWork logo and **Download our Mobile App** bottom card.

2. **Landing Page (2 Main Buttons)**:
   - Features strictly **Login** and **Sign Up** buttons in top navigation and hero section.
   - Interactive live workforce card stack.
   - **Organization Culture Galleries**: Filterable photo showcase ("All", "Engineering & Design", "Culture & Retreats", "Leadership & Summits") with lightbox preview.
   - Company impact metrics & enterprise testimonials.
   - Rich multi-column footer with newsletter email subscription.

3. **Database Recruitment Gate & Password Security Engine**:
   - Password Strength Meter (0–100%) enforcing 5 baseline rules.
   - Security gate locking registration unless strength > 50% and baseline rules pass.
   - Alphanumeric candidate ID validation checking `interview_profiles` (blocks non-existent, pending, or rejected candidate IDs).

4. **Recruitment & Interview Board (`InterviewBoardPage.tsx`)**:
   - HR Admin recruitment pipeline board.
   - Candidate scheduling, approvals, and rejections with automated transactional email notifications.

5. **Express Backend & Automated Email Engine (`server.js`)**:
   - Runs on `http://localhost:3001` with Nodemailer.
   - Automatically sends HTML emails for welcome credentials, leave status updates, meeting invites, payslips, and newsletter confirmations.
   - Live Dispatched Email Log modal (`EmailPreviewModal.tsx`) in topbar.

6. **Production Supabase Database Migration (`production_schema.sql`)**:
   - PostgreSQL schema with ENUM types, `chk_interview_id_format`, `chk_employee_id_format`, automated `employee_payroll` VIEW, `handle_supabase_new_user()` security gate trigger on `auth.users`, and Row-Level Security (RLS) policies.

---

## 🚀 Getting Started

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run Express Backend Server (Port 3001)
node server.js

# 3. Run Vite Frontend Dev Server (Port 3000)
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) in your browser.

---

## 🗄️ Database Setup
See [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for instructions on executing `supabase/migrations/production_schema.sql` in your Supabase SQL Editor.
