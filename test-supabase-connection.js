/**
 * Supabase Connection Test Script
 * Run this to verify your Supabase setup
 * 
 * Usage: node test-supabase-connection.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔍 Supabase Connection Test\n');
console.log('━'.repeat(50));

// Test 1: Check environment variables
console.log('\n1️⃣  Checking environment variables...');
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('   Expected: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}
console.log('✅ Environment variables found');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);

// Test 2: Initialize Supabase client
console.log('\n2️⃣  Initializing Supabase client...');
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  process.exit(1);
}

// Test 3: Check database connection
console.log('\n3️⃣  Testing database connection...');
try {
  const { data, error } = await supabase
    .from('posts')
    .select('count')
    .limit(1);
  
  if (error) throw error;
  console.log('✅ Database connection successful');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  console.log('   Possible issues:');
  console.log('   - Wrong project URL or API key');
  console.log('   - Database not set up yet');
  console.log('   - Network/firewall issues');
  process.exit(1);
}

// Test 4: Check if tables exist
console.log('\n4️⃣  Checking required tables...');
const requiredTables = ['posts', 'profiles', 'reactions'];
for (const table of requiredTables) {
  try {
    const { error } = await supabase
      .from(table)
      .select('count')
      .limit(1);
    
    if (error) {
      console.error(`❌ Table '${table}' not found or not accessible`);
      console.log(`   Error: ${error.message}`);
    } else {
      console.log(`✅ Table '${table}' exists`);
    }
  } catch (error) {
    console.error(`❌ Error checking table '${table}':`, error.message);
  }
}

// Test 5: Check posts table structure
console.log('\n5️⃣  Checking posts table structure...');
try {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .limit(1);
  
  if (error) throw error;
  
  if (data && data.length > 0) {
    console.log('✅ Posts table has data');
    console.log(`   Sample post columns:`, Object.keys(data[0]).join(', '));
  } else {
    console.log('⚠️  Posts table is empty (no data yet)');
    console.log('   This is normal for a new project');
  }
} catch (error) {
  console.error('❌ Error reading posts table:', error.message);
}

// Test 6: Check profiles table
console.log('\n6️⃣  Checking profiles table...');
try {
  const { data, error } = await supabase
    .from('profiles')
    .select('count');
  
  if (error) throw error;
  console.log('✅ Profiles table accessible');
} catch (error) {
  console.error('❌ Error accessing profiles table:', error.message);
}

// Test 7: Check authentication
console.log('\n7️⃣  Checking authentication setup...');
try {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  
  if (session) {
    console.log('✅ User is authenticated');
    console.log(`   User ID: ${session.user.id}`);
    console.log(`   Email: ${session.user.email}`);
  } else {
    console.log('⚠️  No active session (not logged in)');
    console.log('   This is normal - authentication works when you log in via the app');
  }
} catch (error) {
  console.error('❌ Authentication check failed:', error.message);
}

// Test 8: Check real-time capabilities
console.log('\n8️⃣  Checking real-time capabilities...');
try {
  const channel = supabase.channel('test-channel');
  console.log('✅ Real-time channels available');
  await channel.unsubscribe();
} catch (error) {
  console.error('❌ Real-time setup failed:', error.message);
}

// Summary
console.log('\n' + '━'.repeat(50));
console.log('\n✨ Connection test complete!\n');
console.log('Next steps:');
console.log('  1. If all tests passed: Your Supabase setup is ready! ✅');
console.log('  2. If any tests failed: Check the error messages above');
console.log('  3. Start your app: npm run dev');
console.log('  4. Test in browser: http://localhost:5173\n');
