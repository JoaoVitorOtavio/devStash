import 'dotenv/config';
import { prisma } from '../src/server/prisma';

async function main() {
  console.log('Database User Reset Started...');
  
  const DEMO_EMAIL = 'demo@devstash.io';
  
  try {
    const totalUsers = await prisma.user.count();
    
    if (totalUsers === 0) {
      console.log('No users found in the database. Nothing to reset!');
      return;
    }

    const otherUsersCount = await prisma.user.count({
      where: {
        email: {
          not: DEMO_EMAIL
        }
      }
    });

    if (otherUsersCount === 0) {
      console.log('No other users found besides the demo user. Nothing to reset!');
      return;
    }

    console.log('Found ' + otherUsersCount + ' other users to delete...');

    const deleteResult = await prisma.user.deleteMany({
      where: {
        email: {
          not: DEMO_EMAIL
        }
      }
    });

    console.log('Successfully deleted ' + deleteResult.count + ' users and all their associated data.');

    const tokenDeleteResult = await prisma.verificationToken.deleteMany({
      where: {
        identifier: {
          not: DEMO_EMAIL
        }
      }
    });
    
    if (tokenDeleteResult.count > 0) {
      console.log('Deleted ' + tokenDeleteResult.count + ' verification tokens.');
    }

    console.log('Database cleanup complete! Demo user was spared.');

  } catch (error) {
    console.error('ERROR during reset:');
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
