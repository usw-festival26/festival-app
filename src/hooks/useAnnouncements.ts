/**
 * 공지사항 데이터 접근 훅
 *
 * 백엔드 NoticeResponse 가 list 응답에 content 를 포함하도록 변경되면서
 * (swagger 2026-05 기준) /api/notices/{id} 상세 엔드포인트가 제거됐다.
 * useAnnouncementById 는 list 결과를 그대로 lookup 만 한다.
 */
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { config } from '@config/env';
import { fetchAnnouncements } from '@api/endpoints';
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

/**
 * 단일 공지 lookup — 더 이상 별도 detail 엔드포인트가 없으므로 list 결과에서 find.
 * useAnnouncements 를 내부에서 사용해 list 페치를 공유한다 (의존 쿼리 없음).
 */
export function useAnnouncementById(id: string): {
  data: Announcement | undefined;
  announcement: Announcement | undefined;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
} {
  const { announcements, isLoading, error, retry } = useAnnouncements();
  const announcement = useMemo(() => {
    if (!id) return undefined;
    return announcements.find((a) => a.id === id);
  }, [announcements, id]);
  return { data: announcement, announcement, isLoading, error, retry };
}
