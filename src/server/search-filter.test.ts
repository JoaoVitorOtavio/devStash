import { describe, it, expect } from 'vitest';
import { encodeSearchValue, searchValueFilter } from './search-filter';

describe('searchValueFilter', () => {
  it('should score an exact title match highest', () => {
    const value = encodeSearchValue('Debounce Hook', 'a long code preview about hooks');
    expect(searchValueFilter(value, 'Debounce Hook')).toBe(1);
  });

  it('should score a title prefix match', () => {
    const value = encodeSearchValue('Debounce Hook', '');
    expect(searchValueFilter(value, 'Deb')).toBe(0.9);
  });

  it('should score a title substring match', () => {
    const value = encodeSearchValue('Debounce Hook', '');
    expect(searchValueFilter(value, 'Hook')).toBe(0.7);
  });

  it('should not match a query that is only a fuzzy subsequence of the content preview', () => {
    // "test" appears as a scattered subsequence in this sentence but not as
    // a real substring — this is exactly the over-matching bug being fixed.
    const value = encodeSearchValue('Debounce Hook', 'the extra style is a hooks helper');
    expect(searchValueFilter(value, 'test')).toBe(0);
  });

  it('should fall back to a lower-weighted match against the content preview', () => {
    const value = encodeSearchValue('Debounce Hook', 'contains the word snippet in it');
    expect(searchValueFilter(value, 'snippet')).toBeCloseTo(0.7 * 0.4);
  });

  it('should return 0 when neither the title nor the preview match', () => {
    const value = encodeSearchValue('Debounce Hook', 'a hook for debouncing values');
    expect(searchValueFilter(value, 'xyz')).toBe(0);
  });

  it('should match everything when the search is empty', () => {
    const value = encodeSearchValue('Debounce Hook', '');
    expect(searchValueFilter(value, '')).toBe(1);
  });

  it('should handle a value with no secondary field', () => {
    const value = encodeSearchValue('React Patterns');
    expect(searchValueFilter(value, 'React Patterns')).toBe(1);
    expect(searchValueFilter(value, 'xyz')).toBe(0);
  });
});
