const TURKISH_MAP: Record<string, string> = {
  ı: 'i',
  I: 'i',
  İ: 'i',
  ş: 's',
  Ş: 's',
  ç: 'c',
  Ç: 'c',
  ö: 'o',
  Ö: 'o',
  ü: 'u',
  Ü: 'u',
  ğ: 'g',
  Ğ: 'g',
  â: 'a',
  Â: 'a',
  î: 'i',
  Î: 'i',
  û: 'u',
  Û: 'u'
};

export function normalizeTurkishSearch(input: string): string {
  return input
    .normalize('NFC')
    .split('')
    .map((char) => TURKISH_MAP[char] ?? char)
    .join('')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}
