<div align="center">

<img src="./public/assets/nexawork-logo.png" alt="NexaWork Logo" width="480" />

### **EVERY WORKDAY, PERFECTLY ALIGNED.**

An enterprise-grade, high-performance Human Resource Management System (HRMS) built for modern organizations. Reconciles daily attendance geofencing, emergency leave workflows, recruitment onboarding verification, RBAC permissions, and automated payroll calculation into one seamless 3-column system-of-record.

---

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## 🌟 Executive Overview

**NexaWork** (DayFlow) solves critical human resource operational overhead by unifying workforce management into a single real-time platform. From candidate recruitment approval gates to instant automated payroll reconciliation, NexaWork ensures complete operational alignment for administrators, HR managers, and employees.

### ✨ Key Design Pillars
- **Align Green (`#1F6D4D`) & Fresh Mint (`#7EC9A0`) Design System**: Built with modern typography, glassmorphism cards, interactive micro-animations, and high-contrast accessibility.
- **Role-Based Access Control (RBAC)**: Strict segregation between Admin Control Tower and Employee Self-Service Workspace.
- **Geofenced Attendance & Proxy Detection**: Real-time location tracking with anomaly detection flags for out-of-bounds check-ins.
- **Emergency Leave Fast-Track**: Pinned emergency leave requests in Amber (`#F2994A`) for immediate 1-click HR resolution.
- **Automated Payroll Engine**: Live percentage-based allowances & deductions math with PDF payslip generation and automated welcome email credentials.

---

## 🚀 Complete Feature Matrix

### 👑 Admin Control Tower (7 Comprehensive Modules)

1. **Admin Dashboard (`/admin/dashboard`)**:
   - **Row 1 — Live Stat Cards**: `Total Employees`, `Present Today`, `Absent Today`, and `On Half-Day/Emergency Leave Today` (pinned in Amber `#F2994A`) with live deep-linking.
   - **Row 2 — Month-to-Date Requests Strip**: Live counters for Total, Approved, Rejected, and Pending leave requests.
   - **Row 3 — Analytics & Queue**: Mon–Sun Attendance Bar Chart, Compliance & Probation alerts, and real-time Leave Requests Queue with inline 1-click Approve/Reject actions. Emergency requests are pinned to the top.
   - **Row 4 — Feed & Meters**: Recent Employee Activity feed, Live Attendance Speedometer (% present), and HR Overhead Reduction Meter (hours saved card).

2. **Employee Directory (`/admin/directory`)**:
   - Master searchable grid/table with live presence status dots (Present, Absent, On Leave).
   - Department, Role, and Status filter dropdowns.
   - **+ Add Employee Modal**: Automated initial password generation, welcome email credentials dispatch, and salary structure initialization.

3. **Employee Profile Manager (`/admin/employee/:id`)**:
   - **3-Tab Layout**: Personal Details, Job Details, and Salary Info (Admin-Only).
   - **Live Salary Calculator**: Instant recalculation of HRA, DA, PF, Professional Tax, and Net Take-Home Pay upon Basic Salary edits before saving.
   - Offboarding deactivation workflow with audit logging.

4. **Attendance Records (`/admin/attendance`)**:
   - Full-width master log with Daily/Weekly views, date range picker, and department filtering.
   - Anomaly warning flags (Proxy Attendance Detector), expandable geofence location data, and 1-click CSV data export.

5. **Leave Requests & Approvals Queue (`/admin/leaves`)**:
   - Resolution Queue with Emergency requests sorted to the top in Amber (`#F2994A`).
   - Standard requests resolution with optional HR comments support and automatic balance deduction.

6. **Payroll Overview Engine (`/admin/payroll`)**:
   - Summary cards (Total Payroll Cost, Next Dispatched Date, Pending Setup count).
   - **Run Payroll Modal**: Anomaly review checks flagging missing punches and salary jumps before final calculation.
   - Itemized payslip generation & publication for employee access.

7. **Admin Settings (`/admin/settings`)**:
   - Company branding profile, shift timing rules, leave policy rules, notification preferences, and RBAC role permissions.

---

### 👤 Employee Self-Service Workspace (6 Comprehensive Modules)

1. **Employee Workspace (`/employee/dashboard`)**:
   - **Row 1 — Today's Overview**: Today's Status badge, Days Present This Month, Pending Approvals, Total Balance remaining.
   - **Row 2 — Leave Balance Strip**: Visual balance cards for Paid (14/18), Sick (8/10), and Unpaid (12 days).
   - **Row 3 — Personal Analytics**: Worked-Hours Bar Chart, Organization Announcements, and Personal Leave Requests list.
   - **Row 4 — Check-In Card & Live Timer**: Live worked-hours timer card, Check-In/Check-Out action, and 1-click "Leave Early / Emergency" trigger.

2. **My Profile (`/employee/profile`)**:
   - Self-service editing for contact number, address, and profile picture avatar (Job role & salary tier protected as read-only).

3. **Personal Attendance (`/employee/attendance`)**:
   - Personal attendance history log with status badges, check-in/out times, and geofence locations. Read-only system-of-record.

4. **Leave & Time-Off Center (`/employee/leaves`)**:
   - 4 Leave Balance cards featuring Align Green completion rings.
   - Standard Leave Request Form modal and instant 1-click Emergency Leave action.
   - Personal Leave History Table with HR approval comments.

5. **My Payslips (`/employee/payslips`)**:
   - Issued monthly payslips list displaying Pay Period, Dispatched Date, Gross Earnings, Total Deductions, and Net Take-Home Pay.
   - Detailed itemized view modal and PDF statement download.

6. **Employee Settings (`/employee/settings`)**:
   - Notification preferences toggle, security password change, and theme preferences.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite 6 |
| **Styling & UI** | Vanilla CSS Tokens, TailwindCSS 3.4, Lucide Icons, Glassmorphism Cards |
| **State Management** | React Context API (`AppContext`), LocalStorage Fallback Store |
| **Backend & Email Server**| Express.js, Node.js, Nodemailer (Ethereal Auto-Preview / Real Gmail SMTP) |
| **Database & Security** | Supabase PostgreSQL 15, Supabase Auth (`auth.users`), Row-Level Security (RLS) |
| **Database Logic** | PL/pgSQL Triggers, Automated Views (`employee_payroll`), Custom ENUM Types |

---

## 📁 Repository File Structure

```
NexaWork-website/
├── public/
│   └── assets/
│       ├── nexawork-logo.png             # Official NexaWork high-res logo
│       ├── nexawork-logo-transparent.png # Transparent background logo
│       └── nexawork-logo-white.png       # White typography logo for dark footers
├── src/
│   ├── assets/                          # Static assets
│   ├── components/
│   │   ├── attendance/                  # Attendance tables & modals
│   │   ├── employees/                   # Directory grids & tab forms
│   │   ├── layout/                      # Topbar, Sidebar, Official NexaWorkLogo
│   │   ├── leave/                       # Leave modals & approval tables
│   │   └── payroll/                     # Payslip viewer & payroll wizard
│   ├── lib/
│   │   ├── context/                     # AppContext global state manager
│   │   ├── data/                        # Mock data & sample initializers
│   │   └── supabaseClient.ts            # Supabase JS SDK client instance
│   ├── pages/
│   │   ├── admin/                       # 7 Admin Portal Pages
│   │   ├── auth/                        # Login & Registration Page
│   │   ├── employee/                    # 6 Employee Portal Pages
│   │   └── landing/                     # Landing Page (Default View)
│   ├── types/                           # TypeScript interfaces
│   ├── App.tsx                          # Core Application Routing
│   └── main.tsx                         # Entry point
├── supabase/
│   └── migrations/
│       ├── production_schema.sql        # Supabase PostgreSQL production migration
│       └── seed_data.sql                # Initial test dataset
├── server.js                            # Express backend server (Email notifications)
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Patelved2307/DayFlow-odoo-2026.git
cd DayFlow-odoo-2026
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root (or copy `.env.example`):
```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"

# Backend Express Server
PORT=3001

# SMTP Email Configuration (Optional - Defaults to Ethereal Auto-Preview)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

APP_URL="http://localhost:3000"
```

### 4. Run Database Migration on Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** (`>_` icon on left menu) -> **New Query**.
3. Copy and paste the contents of [`supabase/migrations/production_schema.sql`](./supabase/migrations/production_schema.sql) and click **Run**.

### 5. Launch Development Servers
Run the frontend web application:
```bash
npm run dev
```
*(Runs on `http://localhost:3000`)*

Run the backend email server (in a second terminal):
```bash
node server.js
```
*(Runs on `http://localhost:3001`)*

---

## 🗄️ Database Architecture & Complete DB Schema

The database runs on **Supabase PostgreSQL 15** with automated security triggers, custom PL/pgSQL validation routines, and fine-grained Row-Level Security (RLS) policies.

---

### 📊 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    auth_users ||--|| employees : "1-to-1 Supabase Auth Link (id)"
    interview_profiles ||--|| employees : "1-to-1 Onboarding Gate (interview_id)"
    employees ||--o{ attendance_logs : "1-to-Many Daily Punches (employee_id)"
    employees ||--o{ leave_requests : "1-to-Many Time-Off Requests (employee_id)"
    employees ||--|| leave_balances : "1-to-1 Leave Ledger (employee_id)"
    employees ||--|| salary_structures : "1-to-1 Compensation Setup (employee_id)"
    salary_structures ||--|| employee_payroll : "Calculates Payroll View (employee_id)"

    interview_profiles {
        string interview_id PK "Format: INT-XXX-YYYY-NNNNN"
        string candidate_name
        string email UK
        string phone
        string applied_role
        date applied_date
        date interview_date
        interview_status status "Pending | Approved | Rejected"
        timestamptz created_at
        timestamptz updated_at
    }

    employees {
        uuid id PK, FK "References auth.users(id)"
        string employee_id UK "Format: COEDELKOLH00508"
        string interview_id UK, FK "References interview_profiles(interview_id)"
        string full_name
        string email UK
        user_role role "ADMIN | EMPLOYEE"
        string phone
        text address
        string profile_picture_url
        string department
        string job_role
        string designation
        date joining_date
        timestamptz created_at
        timestamptz updated_at
    }

    attendance_logs {
        uuid id PK
        string employee_id FK "References employees(employee_id)"
        date date
        time check_in
        time check_out
        attendance_status status "Present | Absent | Half-day | Leave"
        timestamptz created_at
    }

    leave_requests {
        uuid id PK
        string employee_id FK "References employees(employee_id)"
        leave_type leave_type "Paid | Sick | Unpaid"
        date start_date
        date end_date
        leave_status status "Pending | Approved | Rejected"
        text employee_remarks
        text admin_comments
        timestamptz created_at
        timestamptz updated_at
    }

    leave_balances {
        string employee_id PK, FK "References employees(employee_id)"
        int paid_leave_balance "Default: 15"
        int sick_leave_balance "Default: 10"
        int unpaid_leave_balance "Default: 5"
    }

    salary_structures {
        string employee_id PK, FK "References employees(employee_id)"
        decimal basic_salary "Check >= 0.00"
        int no_of_working_days "Default: 22"
        decimal dearness_allowance_pct "Default: 5.00%"
        decimal house_rent_allowance_pct "Default: 15.00%"
        decimal travel_allowance_pct "Default: 10.00%"
        decimal special_allowance_pct "Default: 10.00%"
        decimal provident_fund_pct "Default: 12.00%"
        decimal professional_tax "Default: 200.00"
        timestamptz updated_at
    }
```

---

### 🔠 Custom ENUM Types

| ENUM Name | Enum Values / Allowed Options | Purpose & Context |
| :--- | :--- | :--- |
| `public.user_role` | `'ADMIN'`, `'EMPLOYEE'` | Role-Based Access Control (RBAC) permissions |
| `public.attendance_status` | `'Present'`, `'Absent'`, `'Half-day'`, `'Leave'` | Daily attendance punch state tracking |
| `public.leave_type` | `'Paid'`, `'Sick'`, `'Unpaid'` | Categories of employee time-off requests |
| `public.leave_status` | `'Pending'`, `'Approved'`, `'Rejected'` | HR approval workflow state |
| `public.interview_status` | `'Pending'`, `'Approved'`, `'Rejected'` | Recruitment onboarding qualification status |

---

### 📋 Comprehensive Database Tables Schema

#### 1. `public.interview_profiles` (Recruitment Board Registry)
Stores prospective and interviewed candidate profiles. Registration is locked until status is `'Approved'`.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `interview_id` | `VARCHAR(15)` | **PRIMARY KEY**, CHECK regex `^INT-[A-Z]{3}-[0-9]{4}-[0-9]{5}$` | Candidate interview registration key |
| `candidate_name`| `VARCHAR(100)` | `NOT NULL` | Candidate's full name |
| `email` | `VARCHAR(100)` | **UNIQUE**, `NOT NULL` | Candidate contact email |
| `phone` | `VARCHAR(20)` | `NULLABLE` | Candidate contact phone number |
| `applied_role` | `VARCHAR(50)` | `NOT NULL` | Role candidate applied for |
| `applied_date` | `DATE` | `NOT NULL`, `DEFAULT CURRENT_DATE` | Application submission date |
| `interview_date`| `DATE` | `NULLABLE` | Scheduled interview date |
| `status` | `interview_status` | `NOT NULL`, `DEFAULT 'Pending'` | Interview process state |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Last updated timestamp |

---

#### 2. `public.employees` (Master Employee Directory)
Links 1-to-1 with Supabase `auth.users(id)` and verified candidate `interview_profiles`.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PRIMARY KEY**, **FK** -> `auth.users(id)` ON DELETE CASCADE | Unique Supabase Auth user link |
| `employee_id` | `VARCHAR(15)` | **UNIQUE**, `NOT NULL`, CHECK regex `^[A-Z]{2}[A-Z]{2}[A-Z]{2}[A-Z]{3}[HE][0-9]{5}$` | Alphanumeric corporate employee ID |
| `interview_id` | `VARCHAR(15)` | **UNIQUE**, `NOT NULL`, **FK** -> `interview_profiles(interview_id)` | Link to verified recruitment record |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Employee full name |
| `email` | `VARCHAR(100)` | **UNIQUE**, `NOT NULL` | Corporate email address |
| `role` | `user_role` | `NOT NULL`, `DEFAULT 'EMPLOYEE'` | RBAC system role (`ADMIN` or `EMPLOYEE`) |
| `phone` | `VARCHAR(20)` | `NULLABLE` | Contact phone number |
| `address` | `TEXT` | `NULLABLE` | Physical residential address |
| `profile_picture_url`| `VARCHAR(255)`| `NULLABLE` | Avatar image URL |
| `department` | `VARCHAR(50)` | `NOT NULL` | Assigned department (e.g. Engineering) |
| `job_role` | `VARCHAR(50)` | `NOT NULL` | Active job role title |
| `designation` | `VARCHAR(50)` | `NOT NULL` | Organizational hierarchy level |
| `joining_date` | `DATE` | `NOT NULL`, `DEFAULT CURRENT_DATE` | Official onboarding date |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Last updated timestamp |

---

#### 3. `public.attendance_logs` (Daily Attendance & Punch Ledger)

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PRIMARY KEY**, `DEFAULT uuid_generate_v4()` | Unique log identifier |
| `employee_id` | `VARCHAR(15)` | **FK** -> `employees(employee_id)` ON DELETE CASCADE | Target employee ID |
| `date` | `DATE` | `NOT NULL`, `DEFAULT CURRENT_DATE` | Punch log date |
| `check_in` | `TIME` | `NULLABLE` | Daily check-in timestamp |
| `check_out` | `TIME` | `NULLABLE` | Daily check-out timestamp |
| `status` | `attendance_status` | `NOT NULL`, `DEFAULT 'Absent'` | Punch presence status |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Log record creation time |
| *Composite* | UNIQUE | `UNIQUE(employee_id, date)` | Prevents duplicate daily logs per employee |

---

#### 4. `public.leave_requests` (Time-Off & Emergency Leave Log)

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PRIMARY KEY**, `DEFAULT uuid_generate_v4()` | Unique request identifier |
| `employee_id` | `VARCHAR(15)` | **FK** -> `employees(employee_id)` ON DELETE CASCADE | Target employee ID |
| `leave_type` | `leave_type` | `NOT NULL` | Paid, Sick, or Unpaid |
| `start_date` | `DATE` | `NOT NULL` | Leave start date |
| `end_date` | `DATE` | `NOT NULL`, CHECK `end_date >= start_date` | Leave end date |
| `status` | `leave_status` | `NOT NULL`, `DEFAULT 'Pending'` | Workflow approval state |
| `employee_remarks`| `TEXT` | `NULLABLE` | Employee request justification |
| `admin_comments` | `TEXT` | `NULLABLE` | HR / Admin response notes |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Request timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Last updated timestamp |

---

#### 5. `public.leave_balances` (Employee Running Leave Ledger)

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `employee_id` | `VARCHAR(15)` | **PRIMARY KEY**, **FK** -> `employees(employee_id)` ON DELETE CASCADE | Target employee ID |
| `paid_leave_balance` | `INT` | `NOT NULL`, `DEFAULT 15`, CHECK `>= 0` | Available paid leave days |
| `sick_leave_balance` | `INT` | `NOT NULL`, `DEFAULT 10`, CHECK `>= 0` | Available sick leave days |
| `unpaid_leave_balance` | `INT` | `NOT NULL`, `DEFAULT 5`, CHECK `>= 0` | Allowed unpaid leave days |

---

#### 6. `public.salary_structures` (Employee Compensation Setup)

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `employee_id` | `VARCHAR(15)` | **PRIMARY KEY**, **FK** -> `employees(employee_id)` ON DELETE CASCADE | Target employee ID |
| `basic_salary` | `DECIMAL(10,2)` | `NOT NULL`, `DEFAULT 0.00`, CHECK `>= 0` | Monthly base salary |
| `no_of_working_days`| `INT` | `NOT NULL`, `DEFAULT 22`, CHECK `> 0` | Expected monthly working days |
| `dearness_allowance_pct` | `DECIMAL(5,2)` | `NOT NULL`, `DEFAULT 5.00%`, CHECK `>= 0` | DA percentage of Basic Salary |
| `house_rent_allowance_pct` | `DECIMAL(5,2)` | `NOT NULL`, `DEFAULT 15.00%`, CHECK `>= 0` | HRA percentage of Basic Salary |
| `travel_allowance_pct` | `DECIMAL(5,2)` | `NOT NULL`, `DEFAULT 10.00%`, CHECK `>= 0` | TA percentage of Basic Salary |
| `special_allowance_pct` | `DECIMAL(5,2)` | `NOT NULL`, `DEFAULT 10.00%`, CHECK `>= 0` | Special allowance % of Basic |
| `provident_fund_pct` | `DECIMAL(5,2)` | `NOT NULL`, `DEFAULT 12.00%`, CHECK `>= 0` | PF deduction % of Basic |
| `professional_tax` | `DECIMAL(10,2)` | `NOT NULL`, `DEFAULT 200.00`, CHECK `>= 0` | Flat professional tax deduction |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Last revision timestamp |

---

### 🧮 Automated Database Views

#### `public.employee_payroll` View
Performs live, on-the-fly math joining `salary_structures` and `employees`:

$$\text{Total Allowances} = \text{Basic} \times \frac{\text{DA\%} + \text{HRA\%} + \text{TA\%} + \text{Special\%}}{100}$$

$$\text{Total Deductions} = \left(\text{Basic} \times \frac{\text{PF\%}}{100}\right) + \text{Professional Tax}$$

$$\text{Net Salary} = \text{Basic Salary} + \text{Total Allowances} - \text{Total Deductions}$$

---

### ⚡ Automated Triggers & PL/pgSQL Functions

1. **`handle_supabase_new_user()` Trigger (`SECURITY DEFINER`)**:
   - Executes AFTER `INSERT` on `auth.users`.
   - Intercepts registration metadata (`interview_id`, `employee_id`).
   - Validates Employee ID regex pattern (`^[A-Z]{2}[A-Z]{2}[A-Z]{2}[A-Z]{3}[HE][0-9]{5}$`).
   - Checks candidate status in `interview_profiles`: blocks registration if profile is missing, `'Pending'`, or `'Rejected'`.
   - On approval, automatically inserts a new record into `public.employees`.

2. **`handle_new_employee_init()` Trigger**:
   - Executes AFTER `INSERT` on `public.employees`.
   - Automatically initializes default leave balances (15 Paid, 10 Sick, 5 Unpaid) in `leave_balances`.
   - Initializes default base salary ($0.00) in `salary_structures` ready for HR setup.

3. **`update_timestamp()` Trigger**:
   - Automatically updates `updated_at = CURRENT_TIMESTAMP` before any update on `employees`, `leave_requests`, and `interview_profiles`.

---

### 🔐 Row-Level Security (RLS) Policies

| Table | Policy Name | Access Scope | Condition / Check Logic |
| :--- | :--- | :--- | :--- |
| **`employees`** | Admins can manage all employee profiles | `ALL` | `is_admin() = true` |
| | Employees can view their own profile | `SELECT` | `auth.uid() = id` |
| | Employees can update limited personal info | `UPDATE` | `auth.uid() = id` (role & job details locked) |
| **`attendance_logs`** | Admins can manage all attendance logs | `ALL` | `is_admin() = true` |
| | Employees can view their own attendance | `SELECT` | `employee_id = current_employee_id` |
| | Employees can log their own attendance | `INSERT` | `employee_id = current_employee_id` |
| **`leave_requests`** | Admins can manage all leave requests | `ALL` | `is_admin() = true` |
| | Employees can view their own requests | `SELECT` | `employee_id = current_employee_id` |
| | Employees can submit leave requests | `INSERT` | `employee_id = current_employee_id AND status = 'Pending'` |
| **`leave_balances`** | Admins can manage all leave balances | `ALL` | `is_admin() = true` |
| | Employees can view their own balances | `SELECT` | `employee_id = current_employee_id` |
| **`salary_structures`** | Admins can manage all salary structures | `ALL` | `is_admin() = true` |
| | Employees can view their own salary | `SELECT` | `employee_id = current_employee_id` |
| **`interview_profiles`**| Admins can manage candidate profiles | `ALL` | `is_admin() = true` (Unauthenticated blocked) |

---

### 🚀 Indexes & Performance Optimization

- `idx_attendance_employee_date` on `public.attendance_logs (employee_id, date)`
- `idx_leave_employee` on `public.leave_requests (employee_id)`
- `idx_leave_status` on `public.leave_requests (status)`
- `idx_employees_dept` on `public.employees (department)`
- `idx_interview_status` on `public.interview_profiles (status)`
- `idx_interview_email` on `public.interview_profiles (email)`

---

