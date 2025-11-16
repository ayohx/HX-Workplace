/**
 * Seed Script: Create Demo Posts with Images
 *
 * This script creates demo posts in Supabase for testing Story 1.2.
 * Posts include text content and images from Pexels (demo URLs).
 *
 * Run with: npm run seed:posts
 *
 * IMPORTANT:
 * - Requires users to exist first (run: npm run seed:users)
 * - Uses real user IDs from the profiles table
 * - Posts include images for testing display functionality
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
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo posts with images - based on mockData.ts
const demoPosts = [
  {
    content: 'Excited to announce that our Q3 planning sessions will begin next week. Team leads, please prepare your roadmaps and be ready to share with the broader group.',
    media_url: [], // No images for this post
    visibility: 'public' as const,
  },
  {
    content: 'Just finished the new design system documentation. You can find it in the Design team group. Feedback welcome!',
    media_url: ['https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800'],
    visibility: 'public' as const,
  },
  {
    content: 'The new holiday booking campaign is live! Check out the stats from the first 24 hours - we\'re seeing a 35% increase in conversions compared to last year\'s campaign.',
    media_url: [
      'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    visibility: 'public' as const,
  },
  {
    content: 'Team lunch photos from yesterday\'s celebration! 🎉 Great to see everyone together.',
    media_url: [
      'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    visibility: 'public' as const,
  },
  {
    content: 'New office space is looking amazing! Can\'t wait for everyone to see it.',
    media_url: [
      'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    visibility: 'public' as const,
  },
];

async function seedPosts() {
  console.log('🌱 Starting post seeding process...\n');

  // Step 1: Fetch all users to get their IDs
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, name, email')
    .order('created_at', { ascending: true });

  if (usersError) {
    console.error('❌ Error fetching users:', usersError.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.error('❌ No users found! Please run: npm run seed:users first');
    process.exit(1);
  }

  console.log(`📋 Found ${users.length} users\n`);

  // Step 2: Create posts, distributing them across users
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < demoPosts.length; i++) {
    const post = demoPosts[i];
    // Distribute posts across available users
    const userIndex = i % users.length;
    const user = users[userIndex];

    try {
      console.log(`📝 Creating post ${i + 1}/${demoPosts.length} for ${user.name}...`);

      // Calculate timestamp (make posts appear at different times)
      const hoursAgo = (demoPosts.length - i) * 2; // 2 hours apart
      const createdAt = new Date(Date.now() - hoursAgo * 3600000).toISOString();

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: post.content,
          media_url: post.media_url,
          visibility: post.visibility,
          created_at: createdAt,
          updated_at: createdAt,
        })
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        failCount++;
        continue;
      }

      console.log(`   ✅ Created post with ${post.media_url.length} image(s)\n`);
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error: any) {
      console.error(`   ❌ Unexpected error: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully created: ${successCount} posts`);
  console.log(`❌ Failed: ${failCount} posts`);
  console.log('='.repeat(50) + '\n');

  if (successCount > 0) {
    console.log('💡 Demo posts are now available in your feed!');
    console.log('   You can test create/edit/delete/update functionality.\n');
  }
}

// Run the seed function
seedPosts()
  .then(() => {
    console.log('🎉 Post seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Post seeding failed:', error);
    process.exit(1);
  });

