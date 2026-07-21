import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { auth } from '@/auth';
import { createCollection } from '@/server/db/collections';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/server/db/collections', () => ({
  createCollection: vi.fn(),
}));

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/collections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/collections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 when there is no session', async () => {
    (auth as any).mockResolvedValue(null);

    const response = await POST(makeRequest({ name: 'React Patterns' }));
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ success: false, error: 'Unauthorized' });
    expect(createCollection).not.toHaveBeenCalled();
  });

  it('should return 400 when name is missing', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });

    const response = await POST(makeRequest({ name: '   ' }));
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(createCollection).not.toHaveBeenCalled();
  });

  it('should create the collection for the authenticated user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
    const created = { id: 'col-1', name: 'React Patterns', description: null, isFavorite: false, updatedAt: new Date() };
    (createCollection as any).mockResolvedValue(created);

    const response = await POST(makeRequest({ name: 'React Patterns', description: null }));
    const json = await response.json();

    expect(createCollection).toHaveBeenCalledWith('user-123', {
      name: 'React Patterns',
      description: null,
    });
    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true, data: JSON.parse(JSON.stringify(created)) });
  });
});
