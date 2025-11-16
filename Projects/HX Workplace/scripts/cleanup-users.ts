/**
 * Cleanup Script: Delete Test Users
 * 
 * This script deletes all test users from Supabase Auth and their profiles.
 * Use before re-running seed-users.ts with updated test accounts.
 * 
 * Run with: npx tsx scripts/cleanup-users.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please ensure .env.local exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Delete all test user profiles from the database
 */
async function cleanupUsers() {
  console.log('🧹 Starting user cleanup...\n');

  try {
    // Get all profiles
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, name');

    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError.message);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log('✅ No users found in database. Already clean!');
      return;
    }

    console.log(`📋 Found ${profiles.length} users in database:\n`);
    profiles.forEach((profile) => {
      console.log(`   - ${profile.email} (${profile.name})`);
    });

    console.log('\n⚠️  WARNING: This will delete all user data!');
    console.log('⚠️  Make sure you have disabled email confirmation in Supabase settings.');
    console.log('\n🗑️  Deleting users...\n');

    // Delete all profiles (this will cascade delete due to foreign key constraints)
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (dummy condition)

    if (deleteError) {
      console.error('❌ Error deleting profiles:', deleteError.message);
      return;
    }

    console.log('✅ All users deleted successfully!\n');
    console.log('📝 Note: Auth users may still exist in Supabase Auth.');
    console.log('   You can manually delete them from: Supabase Dashboard → Authentication → Users\n');
    console.log('💡 Now run: npm run seed:users (to create fresh test users)\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run cleanup
cleanupUsers();

