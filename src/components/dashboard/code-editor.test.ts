import { describe, it, expect } from 'vitest';
import { toMonacoLanguage } from './code-editor';

describe('toMonacoLanguage', () => {
  it('returns plaintext for null or undefined', () => {
    expect(toMonacoLanguage(null)).toBe('plaintext');
    expect(toMonacoLanguage(undefined)).toBe('plaintext');
  });

  it('returns plaintext for an empty string', () => {
    expect(toMonacoLanguage('')).toBe('plaintext');
  });

  it('normalizes casing and whitespace', () => {
    expect(toMonacoLanguage('  JavaScript  ')).toBe('javascript');
    expect(toMonacoLanguage('PYTHON')).toBe('python');
  });

  it('maps common aliases to Monaco language ids', () => {
    expect(toMonacoLanguage('js')).toBe('javascript');
    expect(toMonacoLanguage('ts')).toBe('typescript');
    expect(toMonacoLanguage('py')).toBe('python');
    expect(toMonacoLanguage('sh')).toBe('shell');
    expect(toMonacoLanguage('bash')).toBe('shell');
    expect(toMonacoLanguage('yml')).toBe('yaml');
    expect(toMonacoLanguage('cs')).toBe('csharp');
  });

  it('passes through languages that already match a Monaco id', () => {
    expect(toMonacoLanguage('rust')).toBe('rust');
    expect(toMonacoLanguage('go')).toBe('go');
  });
});
