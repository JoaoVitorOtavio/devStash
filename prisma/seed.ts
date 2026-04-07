import { PrismaClient } from '../src/generated/prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create Mock User
  const user = await prisma.user.upsert({
    where: { email: 'demo@devstash.io' },
    update: {},
    create: {
      id: 'user_1',
      name: 'John Doe',
      email: 'demo@devstash.io',
      image: 'https://github.com/shadcn.png',
      isPro: true,
    },
  });

  console.log(`✅ User created: ${user.email}`);

  // Create Item Types
  const itemTypes = [
    { id: 'type_snippet', name: 'Snippets', icon: 'code', color: '#3b82f6', isSystem: true },
    { id: 'type_prompt', name: 'Prompts', icon: 'sparkles', color: '#a855f7', isSystem: true },
    { id: 'type_command', name: 'Commands', icon: 'terminal', color: '#f97316', isSystem: true },
    { id: 'type_note', name: 'Notes', icon: 'file-text', color: '#eab308', isSystem: true },
    { id: 'type_file', name: 'Files', icon: 'file', color: '#94a3b8', isSystem: true },
    { id: 'type_image', name: 'Images', icon: 'image', color: '#ec4899', isSystem: true },
    { id: 'type_link', name: 'Links', icon: 'link', color: '#10b981', isSystem: true },
  ];

  for (const type of itemTypes) {
    await prisma.itemType.upsert({
      where: { id: type.id },
      update: {},
      create: {
        ...type,
        userId: user.id,
      },
    });
  }
  console.log('✅ Item types created');

  // Create Collections
  const collections = [
    {
      id: 'coll_1',
      name: 'React Patterns',
      description: 'Common React patterns and hooks',
      isFavorite: true,
      createdAt: new Date('2024-01-06'),
    },
    {
      id: 'coll_2',
      name: 'Context Files',
      description: 'AI context files for projects',
      isFavorite: true,
      createdAt: new Date('2024-01-06'),
    },
    {
      id: 'coll_3',
      name: 'Git Commands',
      description: 'Frequently used git commands',
      isFavorite: true,
      createdAt: new Date('2024-01-06'),
    },
    {
      id: 'coll_4',
      name: 'Python Snippets',
      description: 'Useful Python code snippets',
      isFavorite: false,
      createdAt: new Date('2024-01-06'),
    },
    {
      id: 'coll_5',
      name: 'Interview Prep',
      description: 'Technical interview preparation',
      isFavorite: false,
      createdAt: new Date('2024-01-06'),
    },
    {
      id: 'coll_6',
      name: 'AI Prompts',
      description: 'Curated AI prompts for coding',
      isFavorite: false,
      createdAt: new Date('2024-01-06'),
    },
  ];

  for (const coll of collections) {
    await prisma.collection.upsert({
      where: { id: coll.id },
      update: {},
      create: {
        ...coll,
        userId: user.id,
      },
    });
  }
  console.log('✅ Collections created');

  // Create Items
  const items = [
    {
      id: 'item_1',
      title: 'useAuth Hook',
      description: 'Custom authentication hook for React applications',
      typeId: 'type_snippet',
      collectionId: 'coll_1',
      isFavorite: true,
      isPinned: true,
      createdAt: new Date('2024-03-28T10:00:00Z'),
      content: '```typescript\nconst useAuth = () => {\n  // implementation\n};\n```',
      contentType: 'text',
    },
    {
      id: 'item_2',
      title: 'API Error Handling Pattern',
      description: 'Fetch wrapper with exponential backoff retry logic',
      typeId: 'type_snippet',
      collectionId: 'coll_1',
      isFavorite: false,
      isPinned: true,
      createdAt: new Date('2024-03-27T15:30:00Z'),
      content: '```typescript\nconst useAuth = () => {\n  // implementation\n};\n```',
      contentType: 'text',
    },
    {
      id: 'item_3',
      title: 'Docker Compose for Next.js',
      description: 'Full stack setup with PostgreSQL and Redis',
      typeId: 'type_command',
      collectionId: 'coll_3',
      isFavorite: true,
      isPinned: false,
      createdAt: new Date('2024-03-25T09:15:00Z'),
      content: '```typescript\nconst useAuth = () => {\n  // implementation\n};\n```',
      contentType: 'text',
    },
    {
      id: 'item_4',
      title: 'Main App Layout Prompt',
      description: 'AI prompt for generating a responsive dashboard layout',
      typeId: 'type_prompt',
      collectionId: 'coll_2',
      isFavorite: false,
      isPinned: false,
      createdAt: new Date('2024-03-24T14:20:00Z'),
      content: 'I need a responsive dashboard layout with a sidebar...',
      contentType: 'text',
    },
    {
      id: 'item_5',
      title: 'Tailwind V4 Setup Guide',
      description: 'Step-by-step instructions for migrating to Tailwind V4',
      typeId: 'type_note',
      collectionId: 'coll_2',
      isFavorite: true,
      isPinned: true,
      createdAt: new Date('2024-03-22T11:45:00Z'),
      content: '1. Install tailwindcss\n2. Use @import "tailwindcss"',
      contentType: 'text',
    },
    {
      id: 'item_6',
      title: 'Git Squash Rebase Command',
      description: 'Quick command to squash last 3 commits',
      typeId: 'type_command',
      collectionId: 'coll_3',
      isFavorite: false,
      isPinned: false,
      createdAt: new Date('2024-03-21T16:50:00Z'),
      content: 'git rebase -i HEAD~3',
      contentType: 'text',
    },
    {
      id: 'item_7',
      title: 'Python List Comprehension',
      description: 'Examples of common list comprehension patterns',
      typeId: 'type_snippet',
      collectionId: 'coll_4',
      isFavorite: false,
      isPinned: false,
      createdAt: new Date('2024-03-20T13:10:00Z'),
      content: '[x for x in list if x > 10]',
      contentType: 'text',
    },
    {
      id: 'item_8',
      title: 'System Design Interview Checklist',
      description: 'Key points to cover during system design interviews',
      typeId: 'type_note',
      collectionId: 'coll_5',
      isFavorite: true,
      isPinned: false,
      createdAt: new Date('2024-03-19T10:05:00Z'),
      content: '- Scalability\n- Availability\n- Consistency',
      contentType: 'text',
    },
    {
      id: 'item_9',
      title: 'OpenAI GPT-4o Prompting',
      description: 'Best practices for better results with GPT-4o',
      typeId: 'type_prompt',
      collectionId: 'coll_6',
      isFavorite: true,
      isPinned: true,
      createdAt: new Date('2024-03-18T18:30:00Z'),
      content: 'Be concise, provide examples...',
      contentType: 'text',
    },
    {
      id: 'item_10',
      title: 'DevStash Branding Assets',
      description: 'Logos and color palettes for the project',
      typeId: 'type_file',
      collectionId: undefined,
      isFavorite: false,
      isPinned: false,
      createdAt: new Date('2024-03-17T09:40:00Z'),
      content: null,
      contentType: 'file',
    },
    {
      id: 'item_11',
      title: 'Next.js 15 App Router Hook',
      description: 'New useSearchParams behavior in Next.js 15',
      typeId: 'type_snippet',
      collectionId: 'coll_1',
      isFavorite: false,
      isPinned: false,
      createdAt: new Date('2024-03-16T14:15:00Z'),
      content: 'const params = useSearchParams();',
      contentType: 'text',
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...item,
        userId: user.id,
      },
    });
  }
  console.log('✅ Items created');

  console.log('✨ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
