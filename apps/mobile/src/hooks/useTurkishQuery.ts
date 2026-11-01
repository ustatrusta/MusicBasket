import { useEffect, useState } from 'react';
import { normalizeTurkishSearch } from '@muzik-sepeti/shared';

export function useTurkishQuery(query: string, delayMs = 300): string {
  const [normalized, setNormalized] = useState(() => normalizeTurkishSearch(query));

  useEffect(() => {
    const id = setTimeout(() => {
      setNormalized(normalizeTurkishSearch(query));
    }, delayMs);

    return () => clearTimeout(id);
  }, [query, delayMs]);

  return normalized;
}
