import { describe, expect, it } from 'vitest';
import { normalizeTurkishSearch } from '../src/search/turkish';

describe('normalizeTurkishSearch', () => {
  it('normalizes Turkish-specific characters', () => {
    expect(normalizeTurkishSearch('IŞIK ÇÖĞÜ')).toBe('isik cogu');
  });

  it('normalizes circumflex characters and whitespace', () => {
    expect(normalizeTurkishSearch('  KÂR  ŞÎİR  ')).toBe('kar siir');
  });

  it('handles mixed case input', () => {
    expect(normalizeTurkishSearch('Türkü Sözü')).toBe('turku sozu');
  });
});
