/**
 * 공지사항 데이터 접근 훅
 */
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { config } from '@config/env';
import { fetchAnnouncements, fetchAnnouncement } from '@api/endpoints';
import { ANNOUNCEMENTS_DATA } from '@data/announcements';
import type { Announcement } from '../types/announcement';

export function useAnnouncements() {
  const [apiData, setApiData] = useState<Announcement[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);
  // unmount/재요청 시 in-flight 응답이 unmounted state 를 건드리지 않도록 request 식별자로 가드.
  const requestIdRef = useRef(0);

  const retry = useCallback(() => {
    if (!config.isApiEnabled) return;
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    fetchAnnouncements()
      .then((d) => { if (requestId === requestIdRef.current) setApiData(d); })
      .catch((e: Error) => { if (requestId === requestIdRef.current) setError(e.message); })
      .finally(() => { if (requestId === requestIdRef.current) setIsLoading(false); });
  }, []);

  useEffect(() => {
    retry();
    return () => { requestIdRef.current++; };
  }, [retry]);

  // API 활성화 상태에서는 하드코딩 fallback 을 쓰지 않는다.
  // 실패 시 빈 배열과 error 를 반환해 화면이 "불러오지 못함" 을 표시할 수 있게 한다.
  const source = config.isApiEnabled ? (apiData ?? []) : ANNOUNCEMENTS_DATA;

  const announcements = useMemo(() => {
    return [...source].sort((a, b) => {
      // 고정 공지 우선, 그 다음 최신순
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [source]);

  return { data: announcements, announcements, isLoading, error, retry };
}

export function useAnnouncementById(id: string): {
  data: Announcement | undefined;
  announcement: Announcement | undefined;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
} {
  const [apiData, setApiData] = useState<Announcement | null>(null);
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
    fetchAnnouncement(id)
      .then((d) => { if (requestId === requestIdRef.current) setApiData(d); })
      .catch((e: Error) => { if (requestId === requestIdRef.current) setError(e.message); })
      .finally(() => { if (requestId === requestIdRef.current) setIsLoading(false); });
  }, [id]);

  useEffect(() => {
    retry();
    return () => { requestIdRef.current++; };
  }, [retry]);

  const announcement = useMemo(() => {
    if (apiData) return apiData;
    if (config.isApiEnabled) return undefined;
    return ANNOUNCEMENTS_DATA.find((a) => a.id === id);
  }, [apiData, id]);

  return { data: announcement, announcement, isLoading, error, retry };
}
