/**
 * 부스 데이터 접근 훅
 */
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
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

  const retry = useCallback(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    setError(null);
    fetchBooths()
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    retry();
  }, [retry]);

  // API 활성화 시에는 하드코딩 fallback 을 쓰지 않는다 (실패하면 빈 배열 + error).
  const source = config.isApiEnabled ? (apiData ?? []) : BOOTHS_DATA;

  const booths = useMemo(() => {
    return source.filter((booth) => {
      if (category && booth.category !== category) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          booth.name.toLowerCase().includes(q) ||
          (booth.organizer?.toLowerCase().includes(q) ?? false) ||
          (booth.description?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [source, category, searchQuery]);

  return { data: booths, booths, isLoading, error, retry };
}

export function useBoothById(id: string): {
  data: Booth | undefined;
  booth: Booth | undefined;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [apiData, setApiData] = useState<Booth | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);
  // request 식별자: id 가 빠르게 바뀌어도 가장 최신 요청의 응답만 state 에 반영.
  const requestIdRef = useRef(0);

  const retry = useCallback(() => {
    if (!config.isApiEnabled) return;
    const requestId = ++requestIdRef.current;
    setApiData(null);
    setError(null);
    setIsLoading(true);
    fetchBooth(id)
      .then((d) => { if (requestId === requestIdRef.current) setApiData(d); })
      .catch((e: Error) => { if (requestId === requestIdRef.current) setError(e.message); })
      .finally(() => { if (requestId === requestIdRef.current) setIsLoading(false); });
  }, [id]);

  useEffect(() => {
    retry();
    return () => { requestIdRef.current++; };
  }, [retry]);

  const booth = useMemo(() => {
    if (apiData) return apiData;
    if (config.isApiEnabled) return undefined;
    return BOOTHS_DATA.find((b) => b.id === id);
  }, [apiData, id]);

  return { data: booth, booth, isLoading, error, retry };
}

export function useBoothMenus(boothId: string): {
  data: BoothMenuItem[];
  menus: BoothMenuItem[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [apiData, setApiData] = useState<BoothMenuItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);
  // request 식별자: boothId 가 빠르게 바뀌어도 가장 최신 요청의 응답만 state 에 반영.
  const requestIdRef = useRef(0);

  const retry = useCallback(() => {
    if (!config.isApiEnabled) return;
    const requestId = ++requestIdRef.current;
    setApiData(null);
    setError(null);
    setIsLoading(true);
    fetchMenusByBooth(boothId)
      .then((d) => { if (requestId === requestIdRef.current) setApiData(d); })
      .catch((e: Error) => { if (requestId === requestIdRef.current) setError(e.message); })
      .finally(() => { if (requestId === requestIdRef.current) setIsLoading(false); });
  }, [boothId]);

  useEffect(() => {
    retry();
    return () => { requestIdRef.current++; };
  }, [retry]);

  const menus = useMemo(() => {
    if (apiData) return apiData;
    if (config.isApiEnabled) return [];
    const booth = BOOTHS_DATA.find((b) => b.id === boothId);
    return booth?.menuItems ?? [];
  }, [apiData, boothId]);

  return { data: menus, menus, isLoading, error, retry };
}
