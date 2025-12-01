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

// Post content templates for generating varied posts
const textPostTemplates = [
  'Excited to announce that our Q3 planning sessions will begin next week. Team leads, please prepare your roadmaps!',
  'Just finished the new design system documentation. You can find it in the Design team group. Feedback welcome!',
  'Great collaboration session today. Love working with this team!',
  'Sharing some insights from today\'s customer feedback session.',
  'Weekend plans? I\'m planning to catch up on some reading and relax.',
  'Just learned something new today. Always great to keep learning!',
  'Team lunch was fantastic today. Great food and even better company!',
  'Working on something exciting. Can\'t wait to share it with everyone soon!',
  'Grateful for such an amazing team. We accomplish great things together!',
  'Looking forward to the team meeting tomorrow. Have some exciting updates to share!',
];

const imagePostTemplates = [
  'Check out this amazing sunset from our office window! 🌅',
  'Team photo from today\'s meeting. Great group!',
  'Our new office space is looking fantastic!',
  'Behind the scenes of our latest project.',
  'Celebrating a milestone with the team!',
  'Workshop highlights - so much learning happening!',
  'Our workspace transformation is complete!',
  'Team building event was a huge success!',
  'New equipment arrived today. Excited to put it to use!',
  'Office view never gets old. Love this place!',
];

const videoPostTemplates = [
  'Quick demo of our new feature. Let me know what you think!',
  'Team presentation recording for those who couldn\'t make it.',
  'Tutorial walkthrough - hope this helps!',
  'Product demo video. Check it out!',
  'Conference highlights from last week.',
  'Training session recording now available.',
  'Quick update video on our progress.',
  'Customer testimonial video - so inspiring!',
  'Behind the scenes of our development process.',
  'Team introduction video - meet the crew!',
];

const documentPostTemplates = [
  'Shared the quarterly report. Please review when you have a chance.',
  'New policy document uploaded. Everyone should read this.',
  'Project proposal attached. Looking for feedback!',
  'Meeting notes from today\'s session.',
  'Updated guidelines document. Please check it out.',
  'Research findings document. Very interesting insights!',
  'Budget proposal for next quarter.',
  'Process documentation updated.',
  'Training materials now available.',
  'Strategic plan document shared.',
];

// Sample image URLs
const sampleImages = [
  'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=800',
];

// Sample video URLs
const sampleVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
];

// Sample document URLs
const sampleDocuments = [
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
];

/**
 * Generate a random post for a user
 * Returns 10 posts per user: 4 text, 3 image, 2 video, 1 document
 */
function generatePostsForUser(userId: string, userIndex: number): Array<{
  user_id: string;
  content: string;
  media_url: string[];
  visibility: string;
  created_at: string;
  updated_at: string;
}> {
  const posts = [];
  const now = new Date();

  // Mix: 4 text, 3 image, 2 video, 1 document
  const postTypes = [
    ...Array(4).fill('text'),
    ...Array(3).fill('image'),
    ...Array(2).fill('video'),
    ...Array(1).fill('document'),
  ];

  // Shuffle for randomness
  for (let i = postTypes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [postTypes[i], postTypes[j]] = [postTypes[j], postTypes[i]];
  }

  for (let i = 0; i < 10; i++) {
    const postType = postTypes[i];
    let content = '';
    let mediaUrl: string[] = [];

    switch (postType) {
      case 'text':
        content = textPostTemplates[Math.floor(Math.random() * textPostTemplates.length)];
        break;
      case 'image':
        content = imagePostTemplates[Math.floor(Math.random() * imagePostTemplates.length)];
        // Sometimes add 1-2 images
        const numImages = Math.random() > 0.5 ? 1 : 2;
        mediaUrl = Array.from({ length: numImages }, () => 
          sampleImages[Math.floor(Math.random() * sampleImages.length)]
        );
        break;
      case 'video':
        content = videoPostTemplates[Math.floor(Math.random() * videoPostTemplates.length)];
        mediaUrl = [sampleVideos[Math.floor(Math.random() * sampleVideos.length)]];
        break;
      case 'document':
        content = documentPostTemplates[Math.floor(Math.random() * documentPostTemplates.length)];
        mediaUrl = [sampleDocuments[0]];
        break;
    }

    // Spread posts over last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

    posts.push({
      user_id: userId,
      content,
      media_url: mediaUrl,
      visibility: 'public',
      created_at: timestamp.toISOString(),
      updated_at: timestamp.toISOString(),
    });
  }

  return posts;
}

async function seedPosts() {
  console.log('🌱 Starting post seeding process...\n');

  // Step 1: Fetch all users to get their IDs
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, name, email');

  if (usersError) {
    console.error('❌ Error fetching users:', usersError.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.error('❌ No users found! Please run: npm run seed:users first');
    process.exit(1);
  }

  console.log(`📋 Found ${users.length} users\n`);
  console.log(`📝 Generating 10 posts for each user (${users.length * 10} total posts)...\n`);

  // Step 2: Generate all posts (10 per user)
  const allPosts: Array<{
    user_id: string;
    content: string;
    media_url: string[];
    visibility: string;
    created_at: string;
    updated_at: string;
  }> = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(`📝 Generating posts for ${user.name} (${user.email})...`);
    const userPosts = generatePostsForUser(user.id, i);
    allPosts.push(...userPosts);
  }

  console.log(`\n📤 Inserting ${allPosts.length} posts into database...\n`);

  // Step 3: Group posts by user and authenticate as each user to create their posts
  // RLS requires auth.uid() = user_id, so we must authenticate as each user
  let successCount = 0;
  let failCount = 0;

  // Group posts by user_id
  const postsByUser = new Map<string, typeof allPosts>();
  for (const post of allPosts) {
    if (!postsByUser.has(post.user_id)) {
      postsByUser.set(post.user_id, []);
    }
    postsByUser.get(post.user_id)!.push(post);
  }

  // For each user, authenticate and create their posts
  for (const user of users) {
    const userPosts = postsByUser.get(user.id) || [];
    if (userPosts.length === 0) continue;

    console.log(`\n🔐 Authenticating as ${user.name} to create ${userPosts.length} posts...`);

    // Try to sign in as this user
    // Note: This requires knowing the password. For seeding, we'll use a default password
    // If this fails, we'll need to use service role key or disable RLS temporarily
    const testPassword = 'Test123!'; // Default test password from seed-users.ts

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: testPassword,
      });

      if (authError) {
        console.error(`   ❌ Failed to authenticate as ${user.name}: ${authError.message}`);
        console.error(`   ⚠️  Skipping ${userPosts.length} posts for this user`);
        failCount += userPosts.length;
        continue;
      }

      // Create authenticated client for this user
      const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${authData.session?.access_token}`,
          },
        },
      });

      // Insert posts in batches of 10
      const batchSize = 10;
      for (let i = 0; i < userPosts.length; i += batchSize) {
        const batch = userPosts.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(userPosts.length / batchSize);

        try {
          const { data, error } = await userSupabase
            .from('posts')
            .insert(batch)
            .select('id');

          if (error) {
            console.error(`   ❌ Batch ${batchNum}/${totalBatches} failed: ${error.message}`);
            failCount += batch.length;
            continue;
          }

          successCount += batch.length;
          console.log(`   ✅ Batch ${batchNum}/${totalBatches} inserted (${successCount} total)`);

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error: any) {
          console.error(`   ❌ Unexpected error in batch ${batchNum}: ${error.message}`);
          failCount += batch.length;
        }
      }

      // Sign out
      await supabase.auth.signOut();

    } catch (error: any) {
      console.error(`   ❌ Error processing ${user.name}: ${error.message}`);
      failCount += userPosts.length;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully created: ${successCount} posts`);
  console.log(`❌ Failed: ${failCount} posts`);
  console.log(`📊 Posts per user: 10`);
  console.log(`👥 Total users: ${users.length}`);
  console.log('='.repeat(50) + '\n');

  if (successCount > 0) {
    console.log('💡 Test posts are now available in your feed!');
    console.log('   Post types: text-only, images, videos, documents');
    console.log('   Posts spread over last 30 days');
    console.log('   You can now test pagination, infinite scroll, and real-time updates.\n');
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

