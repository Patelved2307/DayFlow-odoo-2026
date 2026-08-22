-- DayFlow / NexaWork Schema-v3 Core Migration: 00001_core_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    interview_id VARCHAR(50),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE' CHECK (role IN ('ADMIN', 'EMPLOYEE')),
    job_role VARCHAR(100) DEFAULT 'Software Engineer',
    designation VARCHAR(100) DEFAULT 'Associate',
    department VARCHAR(100) DEFAULT 'Engineering',
    manager_name VARCHAR(150) DEFAULT 'Eleanor Vance',
    date_of_joining DATE DEFAULT CURRENT_DATE,
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'Probation', 'Notice', 'Offboarded')),
    today_status VARCHAR(30) DEFAULT 'Present' CHECK (today_status IN ('Present', 'Absent', 'On Leave', 'Emergency Leave', 'Half-Day')),
    check_in_time VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leave Balances Table
CREATE TABLE IF NOT EXISTS public.leave_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    paid_remaining NUMERIC(4, 1) DEFAULT 15.0,
    paid_total NUMERIC(4, 1) DEFAULT 18.0,
    sick_remaining NUMERIC(4, 1) DEFAULT 10.0,
    sick_total NUMERIC(4, 1) DEFAULT 10.0,
    unpaid_used NUMERIC(4, 1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_code VARCHAR(50) UNIQUE DEFAULT ('LR-' || floor(random() * 899999 + 100000)::text),
    employee_id VARCHAR(50) NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    employee_name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    type VARCHAR(50) NOT NULL CHECK (type IN ('Paid Leave', 'Sick Leave', 'Unpaid Leave', 'Emergency Half-Day')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count NUMERIC(4, 1) NOT NULL,
    reason TEXT,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Logged')),
    is_emergency BOOLEAN DEFAULT FALSE,
    admin_comment TEXT,
    actioned_by VARCHAR(150),
    actioned_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    employee_name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    date DATE NOT NULL,
    check_in VARCHAR(20),
    check_out VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Present',
    worked_hours NUMERIC(4, 2) DEFAULT 8.0,
    location VARCHAR(150) DEFAULT 'Main HQ (Geofenced)',
    emergency_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Salary Structures Table
CREATE TABLE IF NOT EXISTS public.salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    monthly_basic NUMERIC(10, 2) NOT NULL DEFAULT 6500.00,
    yearly_basic NUMERIC(10, 2) GENERATED ALWAYS AS (monthly_basic * 12) STORED,
    hra NUMERIC(10, 2) GENERATED ALWAYS AS (monthly_basic * 0.40) STORED,
    da NUMERIC(10, 2) GENERATED ALWAYS AS (monthly_basic * 0.10) STORED,
    travel_allowance NUMERIC(10, 2) DEFAULT 500.00,
    special_allowance NUMERIC(10, 2) DEFAULT 800.00,
    pf_deduction NUMERIC(10, 2) GENERATED ALWAYS AS (monthly_basic * 0.12) STORED,
    tax_deduction NUMERIC(10, 2) GENERATED ALWAYS AS (monthly_basic * 0.15) STORED,
    insurance_deduction NUMERIC(10, 2) DEFAULT 250.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payslips Table
CREATE TABLE IF NOT EXISTS public.payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payslip_number VARCHAR(80) UNIQUE NOT NULL,
    employee_id VARCHAR(50) NOT NULL REFERENCES public.employees(employee_id) ON DELETE CASCADE,
    employee_name VARCHAR(150) NOT NULL,
    month VARCHAR(30) NOT NULL,
    period VARCHAR(100) NOT NULL,
    gross_earnings NUMERIC(10, 2) NOT NULL,
    total_deductions NUMERIC(10, 2) NOT NULL,
    net_pay NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
