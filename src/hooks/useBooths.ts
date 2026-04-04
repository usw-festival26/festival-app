/**
 * 부스 데이터 접근 훅
 */
import { useMemo } from 'react';
import { BOOTHS_DATA } from '../data/booths';
import type { Booth, BoothCategory } from '../types/booth';

export interface UseBoothsOptions {
  category?: BoothCategory;
  searchQuery?: string;
}

export function useBooths(options?: UseBoothsOptions) {
  const { category, searchQuery } = options ?? {};

  const booths = useMemo(() => {
    return BOOTHS_DATA.filter((booth) => {
      if (category && booth.category !== category) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          booth.name.toLowerCase().includes(q) ||
          booth.organizer.toLowerCase().includes(q) ||
          booth.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, searchQuery]);

  return { booths, isLoading: false };
}

export function useBoothById(id: string): { booth: Booth | undefined; isLoading: boolean } {
  const booth = useMemo(() => BOOTHS_DATA.find((b) => b.id === id), [id]);
  return { booth, isLoading: false };
}
