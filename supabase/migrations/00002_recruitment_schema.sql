-- DayFlow / NexaWork Schema-v3 Recruitment Migration: 00002_recruitment_schema.sql

-- Interview Profiles & Recruitment Table
CREATE TABLE IF NOT EXISTS public.interview_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id VARCHAR(50) UNIQUE NOT NULL, -- Regex pattern e.g. COEDELKOLH00508
    candidate_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    applied_role VARCHAR(100) NOT NULL,
    applied_date DATE DEFAULT CURRENT_DATE,
    scheduled_date DATE,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    interviewer_name VARCHAR(150) DEFAULT 'Eleanor Vance',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Constraint enforcing alphanumeric Candidate ID format (5-20 characters)
ALTER TABLE public.interview_profiles 
ADD CONSTRAINT chk_interview_id_format 
CHECK (interview_id ~ '^[A-Za-z0-9\-]{5,20}$');

-- Trigger Function: trg_new_employee_init
-- Automatically initializes default leave balances (15 Paid, 10 Sick, 5 Unpaid) and salary profile upon new employee creation
CREATE OR REPLACE FUNCTION public.fn_new_employee_init()
RETURNS TRIGGER AS $$
BEGIN
    -- Initialize default leave balance
    INSERT INTO public.leave_balances (employee_id, paid_remaining, paid_total, sick_remaining, sick_total, unpaid_used)
    VALUES (NEW.employee_id, 15.0, 18.0, 10.0, 10.0, 0.0)
    ON CONFLICT (employee_id) DO NOTHING;

    -- Initialize default salary structure
    INSERT INTO public.salary_structures (employee_id, monthly_basic)
    VALUES (NEW.employee_id, 6500.00)
    ON CONFLICT (employee_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind trigger to employees table
DROP TRIGGER IF EXISTS trg_new_employee_init ON public.employees;
CREATE TRIGGER trg_new_employee_init
AFTER INSERT ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.fn_new_employee_init();
