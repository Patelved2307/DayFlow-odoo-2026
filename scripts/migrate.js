import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.DB_URL;

  if (!dbUrl || dbUrl.includes('your-password')) {
    console.log('\n==========================================================');
    console.log('⚡ NexaWork / DayFlow Supabase Migration Runner');
    console.log('==========================================================');
    console.log('⚠️  DATABASE_URL is not configured in your .env file yet.\n');
    console.log('To execute table creation automatically, add your Postgres connection string to .env:');
    console.log('DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"\n');
    console.log('Alternatively, copy and run the SQL migration directly in Supabase SQL Editor:');
    console.log('📄 file:///' + path.join(__dirname, '../supabase/migrations/production_schema.sql').replace(/\\/g, '/'));
    console.log('==========================================================\n');
    process.exit(0);
  }

  console.log(`[Database Migration] Connecting to Postgres instance...`);

  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('[Database Migration] Connected successfully to database!');

    const schemaPath = path.join(__dirname, '../supabase/migrations/production_schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[Database Migration] Executing production schema SQL migration...');
    await client.query(sql);

    // Optionally execute seed data if available
    const seedPath = path.join(__dirname, '../supabase/migrations/seed_data.sql');
    if (fs.existsSync(seedPath)) {
      console.log('[Database Migration] Seeding initial data...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await client.query(seedSql);
    }

    console.log('\n✅ [Database Migration] SUCCESS! All tables, ENUMs, triggers, and views created:');
    console.log('   - Tables: interview_profiles, employees, attendance_logs, leave_requests, leave_balances, salary_structures');
    console.log('   - Views: employee_payroll');
    console.log('   - Triggers: handle_supabase_new_user, handle_new_employee_init, update_timestamp');
    console.log('   - RLS Policies: is_admin(), employee & admin permissions enabled\n');
  } catch (error) {
    console.error('❌ [Database Migration Error]', error);
  } finally {
    await client.end();
  }
}

runMigration();
