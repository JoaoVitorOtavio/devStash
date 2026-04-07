import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('--- Database Connection & Demo Data Test ---');
  
  try {
    // 1. Connection Check
    console.log('⏳ Connecting to database...');
    const userCount = await prisma.user.count();
    console.log('✅ Connection successful!');
    console.log(`📊 Total users in database: ${userCount}`);

    // 2. Fetch Demo User
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@devstash.io' },
      include: {
        collections: {
          include: {
            _count: {
              select: { items: true }
            }
          }
        },
        itemTypes: {
          where: { isSystem: true }
        }
      }
    });

    if (!demoUser) {
      console.log('❌ Demo user "demo@devstash.io" not found!');
      return;
    }

    console.log('\n👤 Demo User:');
    console.log(`  - Name: ${demoUser.name}`);
    console.log(`  - Email: ${demoUser.email}`);
    console.log(`  - Pro Status: ${demoUser.isPro ? '✅ Pro' : '❌ Free'}`);

    // 3. Collections Summary
    console.log('\n📂 Collections:');
    if (demoUser.collections.length > 0) {
      demoUser.collections.forEach(c => {
        console.log(`  - [${c.id}] ${c.name} (${c._count.items} items)${c.isFavorite ? ' ⭐' : ''}`);
      });
    } else {
      console.log('  - No collections found.');
    }

    // 4. System Types
    const systemTypes = await prisma.itemType.findMany({
      where: { isSystem: true }
    });
    console.log('\n🛠️ System Item Types:');
    systemTypes.forEach(t => {
      console.log(`  - ${t.name} (${t.icon}) - ${t.color}`);
    });

    // 5. Recent Items (last 5)
    const recentItems = await prisma.item.findMany({
      where: { userId: demoUser.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        type: true,
        collection: true,
      }
    });

    console.log('\n📝 Most Recent Items:');
    if (recentItems.length > 0) {
      recentItems.forEach(item => {
        const typeIcon = item.type.icon;
        const collName = item.collection?.name || 'Uncategorized';
        console.log(`  - [${item.type.name.toUpperCase()}] ${item.title} (in: ${collName})`);
      });
    } else {
      console.log('  - No items found.');
    }

    // 6. Summary Stats
    const totalItems = await prisma.item.count({ where: { userId: demoUser.id } });
    console.log(`\n📈 Total Items for Demo User: ${totalItems}`);

  } catch (error) {
    console.error('\n❌ Error during test:');
    if (error instanceof Error) {
      console.error(`Message: ${error.message}`);
      // Log stack for deeper debugging if needed
      // console.error(error.stack);
    } else {
      console.error(error);
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n--- Test Finished ---');
  }
}

main();
