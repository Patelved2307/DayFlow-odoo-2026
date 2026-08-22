-- ==========================================================
-- DayFlow / NexaWork Human Resource Management System
-- Supabase-Specific Production Migration & Deployment Schema
-- ==========================================================
-- This SQL migration file establishes a highly secure, automated, and robust 
-- backend architecture for DayFlow on Supabase.
-- It links PostgreSQL tables with Supabase Auth, enables Row-Level Security (RLS),
-- defines granular RLS policies, and implements backend triggers for registration verification.

-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing views and tables with CASCADE (automatically drops dependent triggers cleanly)
DROP VIEW IF EXISTS public.employee_payroll CASCADE;
DROP TRIGGER IF EXISTS trg_on_supabase_auth_signup ON auth.users;

DROP TABLE IF EXISTS public.salary_structures CASCADE;
DROP TABLE IF EXISTS public.leave_balances CASCADE;
DROP TABLE IF EXISTS public.leave_requests CASCADE;
DROP TABLE IF EXISTS public.attendance_logs CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;
DROP TABLE IF EXISTS public.interview_profiles CASCADE;

DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.attendance_status CASCADE;
DROP TYPE IF EXISTS public.leave_type CASCADE;
DROP TYPE IF EXISTS public.leave_status CASCADE;
DROP TYPE IF EXISTS public.interview_status CASCADE;

-- ==========================================================
-- 1. ENUMS AND CUSTOM DOMAINS
-- ==========================================================

-- Role-Based Access Control (RBAC) System Permissions
CREATE TYPE public.user_role AS ENUM ('ADMIN', 'EMPLOYEE');

-- Daily Attendance Status Categories
CREATE TYPE public.attendance_status AS ENUM ('Present', 'Absent', 'Half-day', 'Leave');

-- Available Leave Type Options
CREATE TYPE public.leave_type AS ENUM ('Paid', 'Sick', 'Unpaid');

-- Operational Leave Request Workflow States
CREATE TYPE public.leave_status AS ENUM ('Pending', 'Approved', 'Rejected');

-- Recruitment Interview Evaluation States
CREATE TYPE public.interview_status AS ENUM ('Pending', 'Approved', 'Rejected');


-- ==========================================================
-- 2. SCHEMAS & TABLES
-- ==========================================================

-- A. Recruitment Board Registry
-- Stores historical and prospective candidate profiles. All working employees
-- must have a matching approved recruitment record.
CREATE TABLE public.interview_profiles (
    interview_id VARCHAR(15) PRIMARY KEY,
    candidate_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    applied_role VARCHAR(50) NOT NULL,
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    interview_date DATE,
    status public.interview_status NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Format validation: INT-XXX-YYYY-NNNNN (e.g., INT-KOL-2026-00045)
    CONSTRAINT chk_interview_id_format
        CHECK (interview_id ~ '^INT-[A-Z]{3}-[0-9]{4}-[0-9]{5}$')
);

-- B. Employees Table (Linked directly to Supabase Auth schema)
-- Keeps track of personal profiles, work roles, and access scopes.
-- Note: password_hash has been removed as passwords are now securely handled 
-- by Supabase Auth (auth.users).
CREATE TABLE public.employees (
    -- Links 1-to-1 with Supabase Auth users table
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Alphanumeric Employee ID
    employee_id VARCHAR(15) UNIQUE NOT NULL,
    
    -- Verified recruitment record linkage
    interview_id VARCHAR(15) UNIQUE NOT NULL REFERENCES public.interview_profiles(interview_id),
    
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role public.user_role NOT NULL DEFAULT 'EMPLOYEE',
    
    -- Self-Managed Contact Information
    phone VARCHAR(20),
    address TEXT,
    profile_picture_url VARCHAR(255),
    
    -- HR-Managed Job Details
    department VARCHAR(50) NOT NULL,
    job_role VARCHAR(50) NOT NULL,          -- Active professional title (e.g., 'Software Engineer')
    designation VARCHAR(50) NOT NULL,       -- Hierarchical tier (e.g., 'Senior Associate')
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Format validation: COEDELKOLH00508
    CONSTRAINT chk_employee_id_format 
        CHECK (employee_id ~ '^[A-Z]{2}[A-Z]{2}[A-Z]{2}[A-Z]{3}[HE][0-9]{5}$')
);

-- C. Daily Attendance Logs
CREATE TABLE public.attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(15) REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIME,
    check_out TIME,
    status public.attendance_status NOT NULL DEFAULT 'Absent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_employee_date UNIQUE (employee_id, date)
);

-- D. Time-Off Leave Requests
CREATE TABLE public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(15) REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    leave_type public.leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status public.leave_status NOT NULL DEFAULT 'Pending',
    employee_remarks TEXT,
    admin_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
);

-- E. Personal Leave Balances (Running Ledger)
CREATE TABLE public.leave_balances (
    employee_id VARCHAR(15) PRIMARY KEY REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    paid_leave_balance INT NOT NULL DEFAULT 15,
    sick_leave_balance INT NOT NULL DEFAULT 10,
    unpaid_leave_balance INT NOT NULL DEFAULT 5,
    
    CONSTRAINT chk_paid_balance CHECK (paid_leave_balance >= 0),
    CONSTRAINT chk_sick_balance CHECK (sick_leave_balance >= 0),
    CONSTRAINT chk_unpaid_balance CHECK (unpaid_leave_balance >= 0)
);

-- F. Salary Structures
CREATE TABLE public.salary_structures (
    employee_id VARCHAR(15) PRIMARY KEY REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    basic_salary DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (basic_salary >= 0),
    no_of_working_days INT NOT NULL DEFAULT 22 CHECK (no_of_working_days > 0),
    
    -- Percentage-based allowances (of Basic Salary)
    dearness_allowance_pct DECIMAL(5, 2) NOT NULL DEFAULT 5.00 CHECK (dearness_allowance_pct >= 0),
    house_rent_allowance_pct DECIMAL(5, 2) NOT NULL DEFAULT 15.00 CHECK (house_rent_allowance_pct >= 0),
    travel_allowance_pct DECIMAL(5, 2) NOT NULL DEFAULT 10.00 CHECK (travel_allowance_pct >= 0),
    special_allowance_pct DECIMAL(5, 2) NOT NULL DEFAULT 10.00 CHECK (special_allowance_pct >= 0),
    
    -- Deductions
    provident_fund_pct DECIMAL(5, 2) NOT NULL DEFAULT 12.00 CHECK (provident_fund_pct >= 0),
    professional_tax DECIMAL(10, 2) NOT NULL DEFAULT 200.00 CHECK (professional_tax >= 0),
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================================
-- 3. VIEWS FOR AUTOMATED MATHS
-- ==========================================================

-- Performs on-the-fly, automated salary calculations.
CREATE OR REPLACE VIEW public.employee_payroll AS
SELECT 
    s.employee_id,
    e.full_name,
    s.basic_salary,
    s.no_of_working_days,
    
    -- Allowances Calculations
    ROUND((s.basic_salary * s.dearness_allowance_pct / 100), 2) AS dearness_allowance,
    ROUND((s.basic_salary * s.house_rent_allowance_pct / 100), 2) AS house_rent_allowance,
    ROUND((s.basic_salary * s.travel_allowance_pct / 100), 2) AS travel_allowance,
    ROUND((s.basic_salary * s.special_allowance_pct / 100), 2) AS special_allowance,
    
    -- Total Allowances
    ROUND((s.basic_salary * (s.dearness_allowance_pct + s.house_rent_allowance_pct + s.travel_allowance_pct + s.special_allowance_pct) / 100), 2) AS total_allowances,
    
    -- Deductions Calculations
    ROUND((s.basic_salary * s.provident_fund_pct / 100), 2) AS provident_fund,
    s.professional_tax,
    
    -- Total Deductions
    ROUND(((s.basic_salary * s.provident_fund_pct / 100) + s.professional_tax), 2) AS total_deductions,
    
    -- Net Salary = Basic + Total Allowances - Total Deductions
    ROUND(
        (s.basic_salary + 
        (s.basic_salary * (s.dearness_allowance_pct + s.house_rent_allowance_pct + s.travel_allowance_pct + s.special_allowance_pct) / 100) - 
        ((s.basic_salary * s.provident_fund_pct / 100) + s.professional_tax)), 
        2
    ) AS net_salary
FROM public.salary_structures s
JOIN public.employees e ON s.employee_id = e.employee_id;


-- ==========================================================
-- 4. FUNCTIONS & TRIGGERS
-- ==========================================================

-- Trigger Function A: Update 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger Function B: Initialize leave and salary sheets upon onboarding
CREATE OR REPLACE FUNCTION public.handle_new_employee_init()
RETURNS TRIGGER AS $$
BEGIN
    -- Initialize running leave balance registry
    INSERT INTO public.leave_balances (employee_id, paid_leave_balance, sick_leave_balance, unpaid_leave_balance)
    VALUES (NEW.employee_id, 15, 10, 5);
    
    -- Initialize blank salary record for Admin modification
    INSERT INTO public.salary_structures (employee_id, basic_salary)
    VALUES (NEW.employee_id, 0.00);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger Function C: Core Supabase Security & Onboarding Sync Gate
-- Automatically intercepts a signup request inside Supabase auth.users,
-- queries recruitment records, validates statuses, and safely writes to the employee table.
CREATE OR REPLACE FUNCTION public.handle_supabase_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_interview_id VARCHAR(15);
    v_employee_id VARCHAR(15);
    v_status public.interview_status;
    v_cand_name VARCHAR(100);
    v_applied_role VARCHAR(50);
    v_phone VARCHAR(20);
    v_reg_count INT;
BEGIN
    -- 1. Parse metadata passed from the frontend signup payload (options.data)
    v_interview_id := (NEW.raw_user_meta_data ->> 'interview_id')::VARCHAR(15);
    v_employee_id := (NEW.raw_user_meta_data ->> 'employee_id')::VARCHAR(15);
    v_phone := (NEW.raw_user_meta_data ->> 'phone')::VARCHAR(20);

    -- Ensure key data points exist
    IF v_interview_id IS NULL THEN
        RAISE EXCEPTION 'Registration Blocked: Onboarding Key (Interview ID) is missing.';
    END IF;

    IF v_employee_id IS NULL THEN
        RAISE EXCEPTION 'Registration Blocked: Employee ID is missing.';
    END IF;

    -- 2. Validate Employee ID format
    IF NOT (v_employee_id ~ '^[A-Z]{2}[A-Z]{2}[A-Z]{2}[A-Z]{3}[HE][0-9]{5}$') THEN
        RAISE EXCEPTION 'Registration Blocked: Invalid Employee ID format. Please use organizational format (e.g., COEDELKOLH00508).';
    END IF;

    -- 3. Check for duplicates in public.employees to prevent duplicate onboarding
    SELECT COUNT(*) INTO v_reg_count FROM public.employees WHERE employee_id = v_employee_id;
    IF v_reg_count > 0 THEN
        RAISE EXCEPTION 'Registration Blocked: An account with Employee ID % already exists.', v_employee_id;
    END IF;

    -- 4. Query the candidate profile from interview_profiles
    SELECT status, candidate_name, applied_role
    INTO v_status, v_cand_name, v_applied_role
    FROM public.interview_profiles
    WHERE interview_id = v_interview_id;

    -- 5. Execute state-based registration checks
    IF v_cand_name IS NULL THEN
        RAISE EXCEPTION 'Registration Blocked: Employee record does not exist. Please check your Onboarding ID or contact HR.';
    END IF;

    IF v_status = 'Pending' THEN
        RAISE EXCEPTION 'Registration Blocked: Your recruitment process is incomplete. Registration is locked until status is Approved.';
    END IF;

    IF v_status = 'Rejected' THEN
        RAISE EXCEPTION 'Registration Blocked: The recruitment record for this ID is marked as Rejected.';
    END IF;

    IF v_status <> 'Approved' THEN
        RAISE EXCEPTION 'Registration Blocked: Unauthorized registration state.';
    END IF;

    -- 6. Insert new public.employees profile linked to the Supabase Auth ID
    INSERT INTO public.employees (
        id,
        employee_id,
        interview_id,
        full_name,
        email,
        role,
        phone,
        department,
        job_role,
        designation,
        joining_date
    )
    VALUES (
        NEW.id,
        v_employee_id,
        v_interview_id,
        v_cand_name,
        NEW.email,
        'EMPLOYEE',
        COALESCE(v_phone, NEW.raw_user_meta_data ->> 'phone'),
        'Engineering',  -- Default department assigned at signup
        v_applied_role, -- Job role set from their approved interview
        'Associate',    -- Default designation assigned at signup
        CURRENT_DATE
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- Runs as superuser to bypass table restrictions safely


-- Assign Triggers
CREATE TRIGGER trg_employees_updated
    BEFORE UPDATE ON public.employees
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER trg_leave_requests_updated
    BEFORE UPDATE ON public.leave_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER trg_interview_profiles_updated
    BEFORE UPDATE ON public.interview_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Hook employees onboarding initialization
CREATE TRIGGER trg_new_employee_init
    AFTER INSERT ON public.employees
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_employee_init();

-- Hook Supabase Auth to auto-register profiles on signup
CREATE TRIGGER trg_on_supabase_auth_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_supabase_new_user();


-- ==========================================================
-- 5. SECURITY & ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable Row-Level Security globally on all tables
ALTER TABLE public.interview_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if the calling Supabase user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.employees 
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------
-- A. Employees Table Policies
-- ----------------------------------------------------------
CREATE POLICY "Admins can manage all employee profiles" 
    ON public.employees FOR ALL TO authenticated 
    USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Employees can view their own profile" 
    ON public.employees FOR SELECT TO authenticated 
    USING (auth.uid() = id);

CREATE POLICY "Employees can update limited personal info" 
    ON public.employees FOR UPDATE TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        role = (SELECT role FROM public.employees WHERE id = auth.uid()) AND -- Prevents self-privilege escalation
        employee_id = (SELECT employee_id FROM public.employees WHERE id = auth.uid()) AND
        interview_id = (SELECT interview_id FROM public.employees WHERE id = auth.uid()) AND
        department = (SELECT department FROM public.employees WHERE id = auth.uid()) AND
        job_role = (SELECT job_role FROM public.employees WHERE id = auth.uid()) AND
        designation = (SELECT designation FROM public.employees WHERE id = auth.uid())
    );

-- ----------------------------------------------------------
-- B. Attendance Logs Policies
-- ----------------------------------------------------------
CREATE POLICY "Admins can manage all attendance logs" 
    ON public.attendance_logs FOR ALL TO authenticated 
    USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Employees can view their own attendance logs" 
    ON public.attendance_logs FOR SELECT TO authenticated 
    USING (employee_id = (SELECT employee_id FROM public.employees WHERE id = auth.uid()));

CREATE POLICY "Employees can log their own attendance" 
    ON public.attendance_logs FOR INSERT TO authenticated 
    WITH CHECK (employee_id = (SELECT employee_id FROM public.employees WHERE id = auth.uid()));

-- ----------------------------------------------------------
-- C. Leave Requests Policies
-- ----------------------------------------------------------
CREATE POLICY "Admins can manage all leave requests" 
    ON public.leave_requests FOR ALL TO authenticated 
    USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Employees can view their own leave requests" 
    ON public.leave_requests FOR SELECT TO authenticated 
    USING (employee_id = (SELECT employee_id FROM public.employees WHERE id = auth.uid()));

CREATE POLICY "Employees can submit leave requests" 
    ON public.leave_requests FOR INSERT TO authenticated 
    WITH CHECK (
        employee_id = (SELECT employee_id FROM public.employees WHERE id = auth.uid()) AND
        status = 'Pending' -- Must start in pending state
    );

-- ----------------------------------------------------------
-- D. Leave Balances Policies
-- ----------------------------------------------------------
CREATE POLICY "Admins can manage all leave balances" 
    ON public.leave_balances FOR ALL TO authenticated 
    USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Employees can view their own leave balances" 
    ON public.leave_balances FOR SELECT TO authenticated 
    USING (employee_id = (SELECT employee_id FROM public.employees WHERE id = auth.uid()));

-- ----------------------------------------------------------
-- E. Salary Structures Policies
-- ----------------------------------------------------------
CREATE POLICY "Admins can manage all salary structures" 
    ON public.salary_structures FOR ALL TO authenticated 
    USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Employees can view their own salary structures" 
    ON public.salary_structures FOR SELECT TO authenticated 
    USING (employee_id = (SELECT employee_id FROM public.employees WHERE id = auth.uid()));

-- ----------------------------------------------------------
-- F. Interview Profiles Policies
-- ----------------------------------------------------------
CREATE POLICY "Admins can manage all recruitment interview profiles" 
    ON public.interview_profiles FOR ALL TO authenticated 
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Note: No select policies exist for unauthenticated users, protecting candidate data privacy.
-- Signup triggers bypass RLS because they run with SECURITY DEFINER privileges.


-- ==========================================================
-- 6. PERFORMANCE & LOOKUP INDEXES
-- ==========================================================
CREATE INDEX idx_attendance_employee_date ON public.attendance_logs (employee_id, date);
CREATE INDEX idx_leave_employee ON public.leave_requests (employee_id);
CREATE INDEX idx_leave_status ON public.leave_requests (status);
CREATE INDEX idx_employees_dept ON public.employees (department);
CREATE INDEX idx_interview_status ON public.interview_profiles (status);
CREATE INDEX idx_interview_email ON public.interview_profiles (email);
