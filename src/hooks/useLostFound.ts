/**
 * 분실물 데이터 접근 훅
 */
import { useMemo } from 'react';
import { LOST_FOUND_DATA } from '../data/lostFound';
import type { LostFoundItem, LostFoundStatus } from '../types/lostFound';

export interface UseLostFoundOptions {
  status?: LostFoundStatus;
  searchQuery?: string;
}

export function useLostFound(options?: UseLostFoundOptions) {
  const { status, searchQuery } = options ?? {};

  const items = useMemo(() => {
    return LOST_FOUND_DATA.filter((item) => {
      if (status && item.status !== status) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort(
      (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
    );
  }, [status, searchQuery]);

  return { items, isLoading: false };
}

export function useLostFoundById(id: string): {
  item: LostFoundItem | undefined;
  isLoading: boolean;
} {
  const item = useMemo(() => LOST_FOUND_DATA.find((i) => i.id === id), [id]);
  return { item, isLoading: false };
}
