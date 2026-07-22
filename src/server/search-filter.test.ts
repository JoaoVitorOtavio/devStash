import { describe, it, expect } from 'vitest';
import { searchValueFilter } from './search-filter';

describe('searchValueFilter', () => {
  it('should score an exact value match highest', () => {
    expect(searchValueFilter('Debounce Hook', 'Debounce Hook', ['a long code preview about hooks'])).toBe(1);
  });

  it('should score a value prefix match', () => {
    expect(searchValueFilter('Debounce Hook', 'Deb')).toBe(0.9);
  });

  it('should score a value substring match', () => {
    expect(searchValueFilter('Debounce Hook', 'Hook')).toBe(0.7);
  });

  it('should not match a query that is only a fuzzy subsequence of a keyword', () => {
    // "test" appears as a scattered subsequence in this sentence but not as
    // a real substring — this is exactly the over-matching bug being fixed.
    expect(searchValueFilter('Debounce Hook', 'test', ['the extra style is a hooks helper'])).toBe(0);
  });

  it('should fall back to a lower-weighted match against keywords', () => {
    expect(searchValueFilter('Debounce Hook', 'snippet', ['contains the word snippet in it']))
      .toBeCloseTo(0.7 * 0.4);
  });

  it('should return 0 when neither the value nor the keywords match', () => {
    expect(searchValueFilter('Debounce Hook', 'xyz', ['a hook for debouncing values'])).toBe(0);
  });

  it('should match everything when the search is empty', () => {
    expect(searchValueFilter('Debounce Hook', '')).toBe(1);
  });

  it('should handle a value with no keywords', () => {
    expect(searchValueFilter('React Patterns', 'React Patterns')).toBe(1);
    expect(searchValueFilter('React Patterns', 'xyz')).toBe(0);
  });
});
