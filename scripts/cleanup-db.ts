import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

/**
 * Cleanup script to delete all users and their associated content
 * EXCEPT for the demo user (demo@devstash.io).
 * 
 * Usage: npx tsx scripts/cleanup-db.ts
 */
async function main() {
  console.log('🧹 Database Cleanup Started...');
  
  const DEMO_EMAIL = 'demo@devstash.io';
  
  try {
    // 1. Check if demo user exists
    const demoUser = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL }
    });
    
    if (!demoUser) {
      console.log(`\n⚠️  CRITICAL: Demo user "${DEMO_EMAIL}" not found!`);
      console.log('To prevent accidental deletion of all data, the script will abort.');
      console.log('Please ensure the demo user exists before running this script.');
      return;
    }
    
    console.log(`\n👤 Demo user found: ${demoUser.name} (${demoUser.email}) [ID: ${demoUser.id}]`);
    console.log('This user and their content will be SPARED.');

    // 2. Count users to be deleted
    const otherUsersCount = await prisma.user.count({
      where: {
        email: {
          not: DEMO_EMAIL
        }
      }
    });

    if (otherUsersCount === 0) {
      console.log('\n✨ No other users found. Database is already clean!');
      return;
    }

    console.log(`\n🗑️  Found ${otherUsersCount} other users to delete...`);

    // 3. Delete other users
    // The Prisma schema has `onDelete: Cascade` for Items, Collections, Tags, ItemTypes, Accounts, and Sessions.
    // So deleting the user will automatically clean up all their related content.
    const deleteResult = await prisma.user.deleteMany({
      where: {
        email: {
          not: DEMO_EMAIL
        }
      }
    });

    console.log(`✅ Successfully deleted ${deleteResult.count} users and all their associated data.`);

    // 4. Cleanup Verification Tokens
    // Verification tokens are not directly linked by ID in the schema but by email (identifier)
    const tokenDeleteResult = await prisma.verificationToken.deleteMany({
      where: {
        identifier: {
          not: DEMO_EMAIL
        }
      }
    });

    if (tokenDeleteResult.count > 0) {
      console.log(`✅ Deleted ${tokenDeleteResult.count} orphaned verification tokens.`);
    }

    console.log('\n🎉 Database cleanup complete!');

  } catch (error) {
    console.error('\n❌ ERROR during cleanup:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
