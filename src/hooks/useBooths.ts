/**
 * 부스 데이터 접근 훅
 */
import { useMemo, useState, useEffect } from 'react';
import { config } from '@config/env';
import { fetchBooths, fetchBooth, fetchMenusByBooth } from '@api/endpoints';
import { BOOTHS_DATA } from '@data/booths';
import type { Booth, BoothCategory, BoothMenuItem } from '../types/booth';

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

  return { data: booths, booths, isLoading, error };
}

export function useBoothById(id: string): { data: Booth | undefined; booth: Booth | undefined; isLoading: boolean; error: string | null } {
  const [apiData, setApiData] = useState<Booth | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    let isCurrent = true;
    setApiData(null);
    setError(null);
    setIsLoading(true);
    fetchBooth(id)
      .then((data) => { if (isCurrent) setApiData(data); })
      .catch((e: Error) => { if (isCurrent) setError(e.message); })
      .finally(() => { if (isCurrent) setIsLoading(false); });
    return () => { isCurrent = false; };
  }, [id]);

  const booth = useMemo(() => {
    if (apiData) return apiData;
    return BOOTHS_DATA.find((b) => b.id === id);
  }, [apiData, id]);

  return { data: booth, booth, isLoading, error };
}

export function useBoothMenus(boothId: string): {
  data: BoothMenuItem[];
  menus: BoothMenuItem[];
  isLoading: boolean;
  error: string | null;
} {
  const [apiData, setApiData] = useState<BoothMenuItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    let isCurrent = true;
    setApiData(null);
    setError(null);
    setIsLoading(true);
    fetchMenusByBooth(boothId)
      .then((data) => { if (isCurrent) setApiData(data); })
      .catch((e: Error) => { if (isCurrent) setError(e.message); })
      .finally(() => { if (isCurrent) setIsLoading(false); });
    return () => { isCurrent = false; };
  }, [boothId]);

  const menus = useMemo(() => {
    if (apiData) return apiData;
    const booth = BOOTHS_DATA.find((b) => b.id === boothId);
    return booth?.menuItems ?? [];
  }, [apiData, boothId]);

  return { data: menus, menus, isLoading, error };
}
