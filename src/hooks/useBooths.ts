/**
 * 부스 데이터 접근 훅
 */
import { useMemo, useState, useEffect } from 'react';
import { config } from '@config/env';
import { fetchBooths, fetchBooth } from '@api/endpoints';
import { BOOTHS_DATA } from '../data/booths';
import type { Booth, BoothCategory } from '../types/booth';

export interface UseBoothsOptions {
  category?: BoothCategory;
  searchQuery?: string;
}

export function useBooths(options?: UseBoothsOptions) {
  const { category, searchQuery } = options ?? {};
  const [apiData, setApiData] = useState<Booth[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    fetchBooths()
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const source = apiData ?? BOOTHS_DATA;

  const booths = useMemo(() => {
    return source.filter((booth) => {
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
  }, [source, category, searchQuery]);

  return { booths, isLoading, error };
}

export function useBoothById(id: string): { booth: Booth | undefined; isLoading: boolean; error: string | null } {
  const [apiData, setApiData] = useState<Booth | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    fetchBooth(id)
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const booth = useMemo(() => {
    if (apiData) return apiData;
    return BOOTHS_DATA.find((b) => b.id === id);
  }, [apiData, id]);

  return { booth, isLoading, error };
}
