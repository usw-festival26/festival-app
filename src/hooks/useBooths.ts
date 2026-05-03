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
  /** 단과대명 정확 일치 필터. 부스 college 가 undefined 면 항상 제외. */
  college?: string;
}

export function useBooths(options?: UseBoothsOptions) {
  const { category, searchQuery, college } = options ?? {};
  const [apiData, setApiData] = useState<Booth[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);
  // unmount/재요청 시 in-flight 응답이 unmounted state 를 건드리지 않도록 request 식별자로 가드.
  const requestIdRef = useRef(0);

  const retry = useCallback(() => {
    if (!config.isApiEnabled) return;
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    fetchBooths()
      .then((d) => { if (requestId === requestIdRef.current) setApiData(d); })
      .catch((e: Error) => { if (requestId === requestIdRef.current) setError(e.message); })
      .finally(() => { if (requestId === requestIdRef.current) setIsLoading(false); });
  }, []);

  useEffect(() => {
    retry();
    return () => { requestIdRef.current++; };
  }, [retry]);

  // API 활성화 시에는 하드코딩 fallback 을 쓰지 않는다 (실패하면 빈 배열 + error).
  const source = config.isApiEnabled ? (apiData ?? []) : BOOTHS_DATA;

  const booths = useMemo(() => {
    return source.filter((booth) => {
      if (category && booth.category !== category) return false;
      if (college && booth.college !== college) return false;
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
  }, [source, category, searchQuery, college]);

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

/**
 * 부스 데이터에서 단과대명 유니크 목록을 뽑아낸다.
 * useBooths 의 source 와 동일하게 API/하드코딩 fallback 을 따른다.
 * 정렬은 입력 등장 순서 (Set 삽입 순) 보존 — 운영자가 booths.ts 에서 의도한 순서대로 칩이 노출됨.
 */
export function useCollegeNames(): string[] {
  const { booths } = useBooths();
  return useMemo(() => {
    const set = new Set<string>();
    for (const b of booths) {
      if (b.college) set.add(b.college);
    }
    return Array.from(set);
  }, [booths]);
}
