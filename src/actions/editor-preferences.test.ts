import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateEditorPreferences } from './editor-preferences';
import { auth } from '@/auth';
import { prisma } from '@/server/prisma';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/server/prisma', () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

const validPreferences = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  theme: 'vs-dark' as const,
};

describe('updateEditorPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns unauthorized when there is no session', async () => {
    (auth as any).mockResolvedValue(null);

    const result = await updateEditorPreferences(validPreferences);

    expect(result).toEqual({ success: false, error: 'Unauthorized' });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects an invalid theme', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });

    const result = await updateEditorPreferences({ ...validPreferences, theme: 'nope' as any });

    expect(result.success).toBe(false);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects a font size out of range', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });

    const result = await updateEditorPreferences({ ...validPreferences, fontSize: 100 });

    expect(result.success).toBe(false);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('saves valid preferences for the authenticated user', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user-123' } });
    (prisma.user.update as any).mockResolvedValue({ id: 'user-123' });

    const result = await updateEditorPreferences(validPreferences);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { editorPreferences: validPreferences },
    });
    expect(result).toEqual({ success: true, data: validPreferences });
  });
});
