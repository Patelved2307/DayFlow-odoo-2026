import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('==========================================================');
console.log('⚡ Supabase Table Insert & Verification Script');
console.log('==========================================================');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  try {
    // 1. Check if public.employees has rows
    const { data: existingRows, error: fetchErr } = await supabase.from('employees').select('*');
    if (fetchErr) {
      console.error('Fetch Error:', fetchErr.message);
    } else {
      console.log(`Current Rows in public.employees: ${existingRows.length}`);
    }

    // 2. Insert or Upsert a test employee row into public.employees
    const testEmployee = {
      employee_id: 'DF-ADM-01',
      full_name: 'Eleanor Vance',
      email: 'admin@nexawork.com',
      role: 'ADMIN',
      phone: '+1 (555) 100-2000',
      department: 'People & HR',
      job_role: 'Head of People & Operations',
      designation: 'Head of People & Operations',
    };

    const { data: insertedData, error: insertErr } = await supabase
      .from('employees')
      .upsert([testEmployee], { onConflict: 'employee_id' })
      .select();

    if (insertErr) {
      console.log('Notice on insert:', insertErr.message);
    } else {
      console.log('✅ Successfully inserted/upserted employee row into public.employees:', insertedData);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testInsert();
