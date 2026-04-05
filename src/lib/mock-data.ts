export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  isPro: boolean;
}

export interface ItemType {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
  isSystem: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isFavorite: boolean;
  types: string[]; // IDs of item types present in this collection
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  title: string;
  description?: string;
  typeId: string;
  collectionId?: string;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  content?: string;
}

export const MOCK_USER: User = {
  id: 'user_1',
  name: 'John Doe',
  email: 'demo@devstash.io',
  image: 'https://github.com/shadcn.png',
  isPro: true,
};

export const MOCK_ITEM_TYPES: ItemType[] = [
  { id: 'type_snippet', name: 'Snippets', icon: 'code', count: 24, color: '#3b82f6', isSystem: true },
  { id: 'type_prompt', name: 'Prompts', icon: 'sparkles', count: 18, color: '#a855f7', isSystem: true },
  { id: 'type_command', name: 'Commands', icon: 'terminal', count: 15, color: '#f97316', isSystem: true },
  { id: 'type_note', name: 'Notes', icon: 'file-text', count: 12, color: '#eab308', isSystem: true },
  { id: 'type_file', name: 'Files', icon: 'file', count: 5, color: '#94a3b8', isSystem: true },
  { id: 'type_image', name: 'Images', icon: 'image', count: 3, color: '#ec4899', isSystem: true },
  { id: 'type_link', name: 'Links', icon: 'link', count: 8, color: '#10b981', isSystem: true },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'coll_1',
    name: 'React Patterns',
    description: 'Common React patterns and hooks',
    itemCount: 12,
    isFavorite: true,
    types: ['type_snippet', 'type_note', 'type_link'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')    
  },
  {
    id: 'coll_2',
    name: 'Context Files',
    description: 'AI context files for projects',
    itemCount: 5,
    isFavorite: true,
    types: ['type_note', 'type_file'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')    
  },
  {
    id: 'coll_3',
    name: 'Git Commands',
    description: 'Frequently used git commands',
    itemCount: 15,
    isFavorite: true,
    types: ['type_command', 'type_note'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')    
  },
  {
    id: 'coll_4',
    name: 'Python Snippets',
    description: 'Useful Python code snippets',
    itemCount: 8,
    isFavorite: false,
    types: ['type_snippet', 'type_note'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')    
  },
  {
    id: 'coll_5',
    name: 'Interview Prep',
    description: 'Technical interview preparation',
    itemCount: 24,
    isFavorite: false,
    types: ['type_note', 'type_snippet', 'type_link', 'type_prompt'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')    
  },
  {
    id: 'coll_6',
    name: 'AI Prompts',
    description: 'Curated AI prompts for coding',
    itemCount: 18,
    isFavorite: false,
    types: ['type_prompt', 'type_snippet', 'type_note'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06')    
  },
];

export const MOCK_ITEMS: Item[] = [
  {
    id: 'item_1',
    title: 'useAuth Hook',
    description: 'Custom authentication hook for React applications',
    typeId: 'type_snippet',
    collectionId: 'coll_1',
    tags: ['react', 'auth', 'hooks'],
    isFavorite: true,
    isPinned: true,
    createdAt: '2024-03-28T10:00:00Z',
    content: '```typescript\nconst useAuth = () => {\n  // implementation\n};\n```'
  },
  {
    id: 'item_2',
    title: 'API Error Handling Pattern',
    description: 'Fetch wrapper with exponential backoff retry logic',
    typeId: 'type_snippet',
    collectionId: 'coll_1',
    tags: ['typescript', 'api', 'patterns'],
    isFavorite: false,
    isPinned: true,
    createdAt: '2024-03-27T15:30:00Z',
    content: '```typescript\nconst useAuth = () => {\n  // implementation\n};\n```'
  },
  {
    id: 'item_3',
    title: 'Docker Compose for Next.js',
    description: 'Full stack setup with PostgreSQL and Redis',
    typeId: 'type_command',
    collectionId: 'coll_3',
    tags: ['docker', 'nextjs', 'devops'],
    isFavorite: true,
    isPinned: false,
    createdAt: '2024-03-25T09:15:00Z',
    content: '```typescript\nconst useAuth = () => {\n  // implementation\n};\n```'
  },
  {
    id: 'item_4',
    title: 'Main App Layout Prompt',
    description: 'AI prompt for generating a responsive dashboard layout',
    typeId: 'type_prompt',
    collectionId: 'coll_2',
    tags: ['ai', 'ui', 'layout'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2024-03-24T14:20:00Z',
    content: 'I need a responsive dashboard layout with a sidebar...'
  },
  {
    id: 'item_5',
    title: 'Tailwind V4 Setup Guide',
    description: 'Step-by-step instructions for migrating to Tailwind V4',
    typeId: 'type_note',
    collectionId: 'coll_2',
    tags: ['css', 'tailwind', 'frontend'],
    isFavorite: true,
    isPinned: true,
    createdAt: '2024-03-22T11:45:00Z',
    content: '1. Install tailwindcss\n2. Use @import "tailwindcss"'
  },
  {
    id: 'item_6',
    title: 'Git Squash Rebase Command',
    description: 'Quick command to squash last 3 commits',
    typeId: 'type_command',
    collectionId: 'coll_3',
    tags: ['git', 'workflow'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2024-03-21T16:50:00Z',
    content: 'git rebase -i HEAD~3'
  },
  {
    id: 'item_7',
    title: 'Python List Comprehension',
    description: 'Examples of common list comprehension patterns',
    typeId: 'type_snippet',
    collectionId: 'coll_4',
    tags: ['python', 'patterns'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2024-03-20T13:10:00Z',
    content: '[x for x in list if x > 10]'
  },
  {
    id: 'item_8',
    title: 'System Design Interview Checklist',
    description: 'Key points to cover during system design interviews',
    typeId: 'type_note',
    collectionId: 'coll_5',
    tags: ['interview', 'design'],
    isFavorite: true,
    isPinned: false,
    createdAt: '2024-03-19T10:05:00Z',
    content: '- Scalability\n- Availability\n- Consistency'
  },
  {
    id: 'item_9',
    title: 'OpenAI GPT-4o Prompting',
    description: 'Best practices for better results with GPT-4o',
    typeId: 'type_prompt',
    collectionId: 'coll_6',
    tags: ['ai', 'openai', 'llm'],
    isFavorite: true,
    isPinned: true,
    createdAt: '2024-03-18T18:30:00Z',
    content: 'Be concise, provide examples...'
  },
  {
    id: 'item_10',
    title: 'DevStash Branding Assets',
    description: 'Logos and color palettes for the project',
    typeId: 'type_file',
    collectionId: undefined,
    tags: ['design', 'branding'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2024-03-17T09:40:00Z',
    content: undefined
  },
  {
    id: 'item_11',
    title: 'Next.js 15 App Router Hook',
    description: 'New useSearchParams behavior in Next.js 15',
    typeId: 'type_snippet',
    collectionId: 'coll_1',
    tags: ['nextjs', 'react'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2024-03-16T14:15:00Z',
    content: 'const params = useSearchParams();'
  },
];

export const MOCK_ITEM_TYPE_COUNT = {
  snippet: 12,
  command: 15,
  note: 12,
  file: 5,
  image: 3,
  link: 8,
  prompt: 24,
}
