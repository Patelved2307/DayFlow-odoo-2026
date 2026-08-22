-- DayFlow / NexaWork Schema-v3 Seed Data: seed_data.sql

-- Seed Interview Profiles (Recruitment Pipeline)
INSERT INTO public.interview_profiles (interview_id, candidate_name, email, phone, applied_role, applied_date, scheduled_date, status) VALUES
('COEDELKOLH00508', 'Aditi Shah', 'aditi.shah@example.com', '+1 (555) 234-5678', 'Senior Frontend Developer', '2026-08-10', '2026-08-25', 'Approved'),
('COEDELKOLH00509', 'Marcus Vance', 'marcus.vance@example.com', '+1 (555) 345-6789', 'Product Designer', '2026-08-14', '2026-08-28', 'Pending'),
('COEDELKOLH00510', 'Sophia Lin', 'sophia.lin@example.com', '+1 (555) 456-7890', 'DevOps Engineer', '2026-08-12', '2026-08-20', 'Rejected')
ON CONFLICT (interview_id) DO NOTHING;

-- Seed Admin Employee (Eleanor Vance)
INSERT INTO public.employees (employee_id, interview_id, full_name, email, phone, password_hash, role, job_role, designation, department) VALUES
('DF-ADMIN-01', 'COEDELKOLH00100', 'Eleanor Vance', 'eleanor.vance@nexawork.com', '+1 (555) 123-4567', '$2a$10$e8K7oY1...hashedpass', 'ADMIN', 'Chief HR Officer', 'VP of HR', 'Executive Management')
ON CONFLICT (employee_id) DO NOTHING;

-- Seed Sample Staff Employee (Ravi Sharma)
INSERT INTO public.employees (employee_id, interview_id, full_name, email, phone, password_hash, role, job_role, designation, department) VALUES
('DF-EMP-104', 'COEDELKOLH00104', 'Ravi Sharma', 'ravi.sharma@nexawork.com', '+1 (555) 987-6543', '$2a$10$e8K7oY1...hashedpass', 'EMPLOYEE', 'Senior Software Engineer', 'Tech Lead', 'Engineering')
ON CONFLICT (employee_id) DO NOTHING;
