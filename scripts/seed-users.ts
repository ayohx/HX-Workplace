/**
 * Seed Script: Create Test Users
 * 
 * This script creates test user accounts in Supabase for development and testing.
 * Run with: npx tsx scripts/seed-users.ts
 * 
 * IMPORTANT SETUP TO AVOID EMAIL BOUNCES:
 * 
 * 1. DISABLE EMAIL CONFIRMATION (Recommended for Development):
 *    - Go to: https://supabase.com/dashboard/project/xbcwbzsgvmerkbnnplep/auth/settings
 *    - Under "Email Auth" → Uncheck "Enable email confirmations"
 *    - This prevents Supabase from sending verification emails to test accounts
 * 
 * 2. EMAIL STRATEGY:
 *    - First test user uses REAL email (ayo.ogunrekun@holidayextras.com)
 *    - Other test users use fake emails (safe when email confirmation disabled)
 *    - Prevents email bounces and Supabase restrictions
 * 
 * 3. REQUIREMENTS:
 *    - Requires .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 *    - Passwords are intentionally simple for testing (NOT for production!)
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
  console.error('Please ensure .env.local contains:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test users based on mock data from src/data/mockData.ts
// IMPORTANT: Using real email for primary test account to avoid bounces
const testUsers = [
  {
    email: 'ayo.ogunrekun@holidayextras.com', // ✅ REAL EMAIL - Primary test account
    password: 'Test123!',
    name: 'Ayo Ogunrekun',
    role: 'PPC Manager and AI Lead',
    department: 'Marketing & Technology',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Leading AI integration and PPC strategy for Holiday Extras.',
    location: 'UK',
  },
  {
    email: 'michael.chen@holidayextras.com',
    password: 'Test123!',
    name: 'Michael Chen',
    role: 'Senior Developer',
    department: 'Engineering',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Full-stack developer passionate about clean code and great UX.',
    location: 'Manchester, UK',
  },
  {
    email: 'emma.williams@holidayextras.com',
    password: 'Test123!',
    name: 'Emma Williams',
    role: 'UX Designer',
    department: 'Design',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Creating beautiful, intuitive experiences that users love.',
    location: 'Birmingham, UK',
  },
  {
    email: 'david.brown@holidayextras.com',
    password: 'Test123!',
    name: 'David Brown',
    role: 'Marketing Director',
    department: 'Marketing',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Driving growth through data-driven marketing strategies.',
    location: 'London, UK',
  },
  {
    email: 'lisa.anderson@holidayextras.com',
    password: 'Test123!',
    name: 'Lisa Anderson',
    role: 'HR Manager',
    department: 'Human Resources',
    avatar: 'https://images.pexels.com/photos/1181524/pexels-photo-1181524.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Building a great workplace culture, one interaction at a time.',
    location: 'Leeds, UK',
  },
];

async function seedUsers() {
  console.log('🌱 Starting user seeding process...\n');

  let successCount = 0;
  let failCount = 0;

  for (const user of testUsers) {
    try {
      console.log(`📧 Creating user: ${user.email}`);

      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role,
            department: user.department,
          },
        },
      });

      if (authError) {
        // Check if user already exists
        if (authError.message.includes('already registered')) {
          console.log(`   ⚠️  User already exists: ${user.email}`);
          
          // Find profile by email and update with avatar and other details
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', user.email)
            .single();
          
          if (fetchError || !profile?.id) {
            console.log(`   ⚠️  Could not find profile to update: ${fetchError?.message || 'Profile not found'}\n`);
            failCount++;
            continue;
          }
          
          // Update the profile with avatar and other details
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              avatar: user.avatar,
              bio: user.bio,
              location: user.location,
              name: user.name,
              role: user.role,
              department: user.department,
            })
            .eq('id', profile.id);
          
          if (updateError) {
            console.error(`   ❌ Profile update failed: ${updateError.message}\n`);
            failCount++;
          } else {
            console.log(`   ✅ Updated profile (including avatar) for existing user: ${user.name}\n`);
            successCount++;
          }
          continue;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user data returned from signup');
      }

      // Step 2: Update the profile with additional details
      // Note: The trigger in the migration should create the profile automatically
      // We just need to update it with additional fields
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error(`   ❌ Profile update failed: ${profileError.message}`);
        failCount++;
        continue;
      }

      console.log(`   ✅ Successfully created user: ${user.name}\n`);
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.error(`   ❌ Failed to create user ${user.email}:`, error.message);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`❌ Failed: ${failCount} users`);
  console.log('='.repeat(50) + '\n');

  if (successCount > 0) {
    console.log('📝 Test User Credentials:');
    console.log('   Email: [any of the above]@holidayextras.com');
    console.log('   Password: Test123!');
    console.log('\n💡 You can now log in with any of these test accounts!\n');
  }
}

// Run the seed function
seedUsers()
  .then(() => {
    console.log('🎉 Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });

