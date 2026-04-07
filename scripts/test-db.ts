import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('--- Database Connection Test ---');
  
  try {
    // Attempt to count users as a simple check
    console.log('⏳ Connecting to database...');
    const userCount = await prisma.user.count();
    
    console.log('✅ Connection successful!');
    console.log(`📊 Number of users in database: ${userCount}`);

    // Try to list first 3 users (if any)
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
      }
    });

    if (users.length > 0) {
      console.log('👤 Sample users:');
      users.forEach(u => console.log(`  - ${u.email} (${u.id})`));
    } else {
      console.log('ℹ️ No users found in the database.');
    }

  } catch (error) {
    console.error('❌ Connection failed!');
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
    } else {
      console.error(error);
    }
  } finally {
    await prisma.$disconnect();
    console.log('--- Test Finished ---');
  }
}

main();
