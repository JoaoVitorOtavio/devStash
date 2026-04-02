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
    createdAt: 'Jan 15',
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
    createdAt: 'Jan 12',
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
    createdAt: 'Jan 10',
    content: '```typescript\nconst useAuth = () => {\n  // implementation\n};\n```'
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
