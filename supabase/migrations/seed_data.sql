-- ==========================================================
-- DayFlow / NexaWork Production Seed Dataset
-- ==========================================================
-- Seed Interview Profiles (Recruitment Pipeline Security Gate)

INSERT INTO public.interview_profiles (interview_id, candidate_name, email, phone, applied_role, applied_date, interview_date, status) VALUES
('2026', 'Patel Ved', 'paved2307@mail.com', '+1 (555) 230-7000', 'Lead Full Stack Engineer', '2026-01-01', '2026-01-05', 'Approved'),
('COEDELKOLH00508', 'Aditi Shah', 'aditi.shah@dayflow.work', '+1 (555) 234-5678', 'Senior Frontend Developer', '2026-08-10', '2026-08-15', 'Approved'),
('COEDELKOLH00509', 'Marcus Vance', 'marcus.vance@dayflow.work', '+1 (555) 345-6789', 'Product Designer', '2026-08-14', '2026-08-20', 'Pending'),
('COEDELKOLH00510', 'Sophia Lin', 'sophia.lin@dayflow.work', '+1 (555) 456-7890', 'DevOps Engineer', '2026-08-12', '2026-08-18', 'Rejected'),
('INT-KOL-2026-00045', 'Sarah Jenkins', 'sarah.jenkins@dayflow.work', '+1 (555) 789-0123', 'Staff Systems Architect', '2026-08-01', '2026-08-05', 'Approved'),
('INT-KOL-2026-00046', 'Daniel Miller', 'daniel.miller@dayflow.work', '+1 (555) 890-1234', 'Backend Go Engineer', '2026-08-02', '2026-08-06', 'Approved')
ON CONFLICT (interview_id) DO NOTHING;

-- Seed Sample Employees
INSERT INTO public.employees (id, employee_id, interview_id, full_name, email, role, phone, department, job_role, designation, joining_date) VALUES
('00000000-0000-0000-0000-000000000000', 'COEDELKOLH02026', '2026', 'Patel Ved', 'paved2307@mail.com', 'EMPLOYEE', '+1 (555) 230-7000', 'Engineering', 'Lead Full Stack Engineer', 'Tech Lead', '2026-01-01'),
('00000000-0000-0000-0000-000000000001', 'COEDELKOLH00508', 'COEDELKOLH00508', 'Aditi Shah', 'aditi.shah@dayflow.work', 'EMPLOYEE', '+1 (555) 234-5678', 'Engineering', 'Senior Frontend Developer', 'Senior Associate', '2026-08-16')
ON CONFLICT (employee_id) DO NOTHING;

-- Seed Leave Balances
INSERT INTO public.leave_balances (employee_id, paid_leave_balance, sick_leave_balance, unpaid_leave_balance) VALUES
('COEDELKOLH02026', 15, 10, 5),
('COEDELKOLH00508', 15, 10, 5)
ON CONFLICT (employee_id) DO NOTHING;

-- Seed Salary Structures
INSERT INTO public.salary_structures (employee_id, basic_salary, no_of_working_days, dearness_allowance_pct, house_rent_allowance_pct, travel_allowance_pct, special_allowance_pct, provident_fund_pct, professional_tax) VALUES
('COEDELKOLH02026', 8500.00, 22, 5.00, 15.00, 10.00, 10.00, 12.00, 200.00),
('COEDELKOLH00508', 7500.00, 22, 5.00, 15.00, 10.00, 10.00, 12.00, 200.00)
ON CONFLICT (employee_id) DO NOTHING;

-- Seed Sample Attendance Logs
INSERT INTO public.attendance_logs (employee_id, date, check_in, check_out, status) VALUES
('COEDELKOLH02026', CURRENT_DATE, '08:58:00', '18:00:00', 'Present'),
('COEDELKOLH00508', CURRENT_DATE, '09:00:00', '18:00:00', 'Present')
ON CONFLICT (employee_id, date) DO NOTHING;
