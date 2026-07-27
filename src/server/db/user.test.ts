import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getEditorPreferences } from './user';
import { prisma } from '@/server/prisma';
import { DEFAULT_EDITOR_PREFERENCES } from '@/server/constants';

vi.mock('@/server/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe('getEditorPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns defaults for guest users without querying the database', async () => {
    const result = await getEditorPreferences('guest-id');

    expect(result).toEqual(DEFAULT_EDITOR_PREFERENCES);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('returns defaults when the user has never saved preferences', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ editorPreferences: null });

    const result = await getEditorPreferences('user-123');

    expect(result).toEqual(DEFAULT_EDITOR_PREFERENCES);
  });

  it('returns the stored preferences when fully populated', async () => {
    const stored = { fontSize: 18, tabSize: 4, wordWrap: false, minimap: true, theme: 'monokai' };
    (prisma.user.findUnique as any).mockResolvedValue({ editorPreferences: stored });

    const result = await getEditorPreferences('user-123');

    expect(result).toEqual(stored);
  });

  it('fills in missing keys with defaults for partial/malformed stored JSON', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({
      editorPreferences: { fontSize: 20, theme: 'not-a-real-theme' },
    });

    const result = await getEditorPreferences('user-123');

    expect(result).toEqual({
      ...DEFAULT_EDITOR_PREFERENCES,
      fontSize: 20,
    });
  });
});
