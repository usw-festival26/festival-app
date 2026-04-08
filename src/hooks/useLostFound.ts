/**
 * 분실물 데이터 접근 훅
 */
import { useMemo, useState, useEffect } from 'react';
import { config } from '@config/env';
import { fetchLostFoundItems, fetchLostFoundItem } from '@api/endpoints';
import { LOST_FOUND_DATA } from '../data/lostFound';
import type { LostFoundItem, LostFoundStatus } from '../types/lostFound';

export interface UseLostFoundOptions {
  status?: LostFoundStatus;
  searchQuery?: string;
}

export function useLostFound(options?: UseLostFoundOptions) {
  const { status, searchQuery } = options ?? {};
  const [apiData, setApiData] = useState<LostFoundItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    fetchLostFoundItems()
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const source = apiData ?? LOST_FOUND_DATA;

  const items = useMemo(() => {
    return source.filter((item) => {
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
  }, [source, status, searchQuery]);

  return { items, isLoading, error };
}

export function useLostFoundById(id: string): {
  item: LostFoundItem | undefined;
  isLoading: boolean;
  error: string | null;
} {
  const [apiData, setApiData] = useState<LostFoundItem | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    fetchLostFoundItem(id)
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const item = useMemo(() => {
    if (apiData) return apiData;
    return LOST_FOUND_DATA.find((i) => i.id === id);
  }, [apiData, id]);

  return { item, isLoading, error };
}
