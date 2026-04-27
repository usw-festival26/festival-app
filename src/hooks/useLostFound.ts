/**
 * 분실물 데이터 접근 훅
 */
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { config } from '@config/env';
import { fetchLostFoundItems, fetchLostFoundItem } from '@api/endpoints';
import { LOST_FOUND_DATA } from '@data/lostFound';
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
  // unmount/재요청 시 in-flight 응답이 unmounted state 를 건드리지 않도록 request 식별자로 가드.
  const requestIdRef = useRef(0);

  const retry = useCallback(() => {
    if (!config.isApiEnabled) return;
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    fetchLostFoundItems()
      .then((d) => { if (requestId === requestIdRef.current) setApiData(d); })
      .catch((e: Error) => { if (requestId === requestIdRef.current) setError(e.message); })
      .finally(() => { if (requestId === requestIdRef.current) setIsLoading(false); });
  }, []);

  useEffect(() => {
    retry();
    return () => { requestIdRef.current++; };
  }, [retry]);

  // API 활성화 시에는 하드코딩 fallback 을 쓰지 않는다 (실패하면 빈 배열 + error).
  const source = config.isApiEnabled ? (apiData ?? []) : LOST_FOUND_DATA;

  const items = useMemo(() => {
    return source.filter((item) => {
      if (status && item.status !== status) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.description?.toLowerCase().includes(q) ?? false) ||
          // location 은 스펙에 없어 없을 수 있음 → 있을 때만 검색 대상.
          (item.location?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    }).sort((a, b) => {
      // reportedAt 이 없으면 정렬 기준에서 제외(가장 뒤로).
      const at = a.reportedAt ? new Date(a.reportedAt).getTime() : 0;
      const bt = b.reportedAt ? new Date(b.reportedAt).getTime() : 0;
      return bt - at;
    });
  }, [source, status, searchQuery]);

  return { data: items, items, isLoading, error, retry };
}

export function useLostFoundById(id: string): {
  data: LostFoundItem | undefined;
  item: LostFoundItem | undefined;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [apiData, setApiData] = useState<LostFoundItem | null>(null);
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
    fetchLostFoundItem(id)
      .then((d) => { if (requestId === requestIdRef.current) setApiData(d); })
      .catch((e: Error) => { if (requestId === requestIdRef.current) setError(e.message); })
      .finally(() => { if (requestId === requestIdRef.current) setIsLoading(false); });
  }, [id]);

  useEffect(() => {
    retry();
    return () => { requestIdRef.current++; };
  }, [retry]);

  const item = useMemo(() => {
    if (apiData) return apiData;
    if (config.isApiEnabled) return undefined;
    return LOST_FOUND_DATA.find((i) => i.id === id);
  }, [apiData, id]);

  return { data: item, item, isLoading, error, retry };
}
