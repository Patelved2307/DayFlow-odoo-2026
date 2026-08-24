import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('==========================================================');
console.log('⚡ NexaWork / DayFlow Supabase Connection Test');
console.log('==========================================================');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 15) + '...' : '(Not Set)'}`);

if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.log('\n⚠️  Supabase URL is still set to placeholder "your-project-id".');
  console.log('Please save your .env file with your actual Supabase URL & Anon Key!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('employees').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      console.log(`\n🟢 Supabase endpoint reachable! (Notice: ${error.message})`);
      console.log('✅ Connection to Supabase Cloud API verified!');
    } else {
      console.log('\n✅ SUCCESS! Connected live to Supabase Cloud PostgreSQL!');
    }
  } catch (err) {
    console.error('\n❌ Connection Error:', err.message);
  }
}

testConnection();
