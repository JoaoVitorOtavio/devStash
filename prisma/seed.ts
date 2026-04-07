import { PrismaClient } from '../src/generated/prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Demo User
  const hashedPassword = await bcrypt.hash('12345678', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@devstash.io' },
    update: {
      password: hashedPassword,
      name: 'Demo User',
      isPro: false,
      emailVerified: new Date(),
    },
    create: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ User created: ${user.email}`);

  // 2. Create System Item Types
  const systemTypes = [
    { name: 'snippet', icon: 'Code', color: '#3b82f6' },
    { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6' },
    { name: 'command', icon: 'Terminal', color: '#f97316' },
    { name: 'note', icon: 'StickyNote', color: '#fde047' },
    { name: 'file', icon: 'File', color: '#6b7280' },
    { name: 'image', icon: 'Image', color: '#ec4899' },
    { name: 'link', icon: 'Link', color: '#10b981' },
  ];

  const typeMap: Record<string, string> = {};

  for (const typeData of systemTypes) {
    const type = await prisma.itemType.upsert({
      where: { 
        id: `type_${typeData.name}`, // Fixed IDs for easier reference
      },
      update: {
        icon: typeData.icon,
        color: typeData.color,
      },
      create: {
        id: `type_${typeData.name}`,
        name: typeData.name,
        icon: typeData.icon,
        color: typeData.color,
        isSystem: true,
      },
    });
    typeMap[typeData.name] = type.id;
  }
  console.log('✅ System item types created');

  // 3. Collections & Items
  
  // React Patterns
  const reactColl = await prisma.collection.upsert({
    where: { id: 'coll_react_patterns' },
    update: {},
    create: {
      id: 'coll_react_patterns',
      name: 'React Patterns',
      description: 'Reusable React patterns and hooks',
      userId: user.id,
      isFavorite: true,
    },
  });

  const reactItems = [
    {
      title: 'useDebounce Hook',
      description: 'A custom hook to debounce value changes',
      content: '```typescript\nimport { useState, useEffect } from "react";\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n```',
      language: 'typescript',
      typeId: typeMap['snippet'],
    },
    {
      title: 'Context Provider Pattern',
      description: 'Standard implementation of React Context with custom hook',
      content: '```tsx\nimport { createContext, useContext, ReactNode } from "react";\n\ninterface MyContextType { /* ... */ }\nconst MyContext = createContext<MyContextType | undefined>(undefined);\n\nexport function MyProvider({ children }: { children: ReactNode }) {\n  return <MyContext.Provider value={{ /* ... */ }}>{children}</MyContext.Provider>;\n}\n\nexport function useMyContext() {\n  const context = useContext(MyContext);\n  if (!context) throw new Error("useMyContext must be used within MyProvider");\n  return context;\n}\n```',
      language: 'tsx',
      typeId: typeMap['snippet'],
    },
    {
      title: 'Utility: cn Helper',
      description: 'Tailwind class merging utility',
      content: '```typescript\nimport { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n```',
      language: 'typescript',
      typeId: typeMap['snippet'],
    },
  ];

  for (const item of reactItems) {
    await prisma.item.create({
      data: {
        ...item,
        userId: user.id,
        collectionId: reactColl.id,
        contentType: 'text',
      },
    });
  }

  // AI Workflows
  const aiColl = await prisma.collection.upsert({
    where: { id: 'coll_ai_workflows' },
    update: {},
    create: {
      id: 'coll_ai_workflows',
      name: 'AI Workflows',
      description: 'AI prompts and workflow automations',
      userId: user.id,
      isFavorite: true,
    },
  });

  const aiItems = [
    {
      title: 'Code Review Prompt',
      description: 'Comprehensive prompt for AI code reviews',
      content: 'You are an expert senior software engineer. Review the following code for: \n1. Performance bottlenecks\n2. Security vulnerabilities\n3. Clean code principles\n4. Potential bugs\n\nCode:\n{{CODE}}',
      typeId: typeMap['prompt'],
    },
    {
      title: 'Documentation Generation',
      description: 'Prompt to generate JSDoc and README content',
      content: 'Based on this TypeScript interface/class, generate comprehensive JSDoc comments and a brief usage example for a README.md file.',
      typeId: typeMap['prompt'],
    },
    {
      title: 'Refactoring Assistance',
      description: 'Prompt for refactoring complex functions',
      content: 'Refactor the following function to improve readability and reduce cognitive complexity. Maintain the same behavior and include unit tests for the new implementation.',
      typeId: typeMap['prompt'],
    },
  ];

  for (const item of aiItems) {
    await prisma.item.create({
      data: {
        ...item,
        userId: user.id,
        collectionId: aiColl.id,
        contentType: 'text',
      },
    });
  }

  // DevOps
  const devopsColl = await prisma.collection.upsert({
    where: { id: 'coll_devops' },
    update: {},
    create: {
      id: 'coll_devops',
      name: 'DevOps',
      description: 'Infrastructure and deployment resources',
      userId: user.id,
    },
  });

  await prisma.item.create({
    data: {
      title: 'Docker Compose Setup',
      description: 'Basic docker-compose for Node.js and Postgres',
      content: '```yaml\nversion: "3.8"\nservices:\n  db:\n    image: postgres:15-alpine\n    ports:\n      - "5432:5432"\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n```',
      typeId: typeMap['snippet'],
      userId: user.id,
      collectionId: devopsColl.id,
      contentType: 'text',
    },
  });

  await prisma.item.create({
    data: {
      title: 'Deployment Script',
      description: 'Simple bash script for production deployment',
      content: '#!/bin/bash\ngit pull origin main\nnpm install\nnpm run build\npm2 restart all',
      typeId: typeMap['command'],
      userId: user.id,
      collectionId: devopsColl.id,
      contentType: 'text',
    },
  });

  await prisma.item.create({
    data: {
      title: 'Neon Documentation',
      url: 'https://neon.tech/docs/introduction',
      typeId: typeMap['link'],
      userId: user.id,
      collectionId: devopsColl.id,
      contentType: 'text',
    },
  });

  await prisma.item.create({
    data: {
      title: 'Cloudflare R2 Docs',
      url: 'https://developers.cloudflare.com/r2/',
      typeId: typeMap['link'],
      userId: user.id,
      collectionId: devopsColl.id,
      contentType: 'text',
    },
  });

  // Terminal Commands
  const termColl = await prisma.collection.upsert({
    where: { id: 'coll_terminal' },
    update: {},
    create: {
      id: 'coll_terminal',
      name: 'Terminal Commands',
      description: 'Useful shell commands for everyday development',
      userId: user.id,
    },
  });

  const termItems = [
    { title: 'Git: Undo Last Commit', content: 'git reset --soft HEAD~1', typeId: typeMap['command'] },
    { title: 'Docker: Clean All', content: 'docker system prune -a --volumes', typeId: typeMap['command'] },
    { title: 'Process: Kill on Port', content: 'lsof -ti:3000 | xargs kill -9', typeId: typeMap['command'] },
    { title: 'NPM: Force Clean Cache', content: 'npm cache clean --force', typeId: typeMap['command'] },
  ];

  for (const item of termItems) {
    await prisma.item.create({
      data: {
        ...item,
        userId: user.id,
        collectionId: termColl.id,
        contentType: 'text',
      },
    });
  }

  // Design Resources
  const designColl = await prisma.collection.upsert({
    where: { id: 'coll_design' },
    update: {},
    create: {
      id: 'coll_design',
      name: 'Design Resources',
      description: 'UI/UX resources and references',
      userId: user.id,
    },
  });

  const designLinks = [
    { title: 'Tailwind CSS v4 Docs', url: 'https://tailwindcss.com/docs' },
    { title: 'Shadcn UI', url: 'https://ui.shadcn.com' },
    { title: 'Lucide Icons', url: 'https://lucide.dev' },
    { title: 'Figma Community', url: 'https://figma.com/community' },
  ];

  for (const link of designLinks) {
    await prisma.item.create({
      data: {
        ...link,
        userId: user.id,
        collectionId: designColl.id,
        typeId: typeMap['link'],
        contentType: 'text',
      },
    });
  }

  console.log('✅ Collections and items created');
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
