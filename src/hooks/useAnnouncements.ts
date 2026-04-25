/**
 * 공지사항 데이터 접근 훅
 */
import { useMemo, useState, useEffect } from 'react';
import { config } from '@config/env';
import { fetchAnnouncements, fetchAnnouncement } from '@api/endpoints';
import { ANNOUNCEMENTS_DATA } from '@data/announcements';
import type { Announcement } from '../types/announcement';

export function useAnnouncements() {
  const [apiData, setApiData] = useState<Announcement[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    fetchAnnouncements()
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

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

  return { data: announcements, announcements, isLoading, error };
}

export function useAnnouncementById(id: string): {
  data: Announcement | undefined;
  announcement: Announcement | undefined;
  isLoading: boolean;
  error: string | null;
} {
  const [apiData, setApiData] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    let isCurrent = true;
    setApiData(null);
    setError(null);
    setIsLoading(true);
    fetchAnnouncement(id)
      .then((data) => { if (isCurrent) setApiData(data); })
      .catch((e: Error) => { if (isCurrent) setError(e.message); })
      .finally(() => { if (isCurrent) setIsLoading(false); });
    return () => { isCurrent = false; };
  }, [id]);

  const announcement = useMemo(() => {
    if (apiData) return apiData;
    if (config.isApiEnabled) return undefined;
    return ANNOUNCEMENTS_DATA.find((a) => a.id === id);
  }, [apiData, id]);

  return { data: announcement, announcement, isLoading, error };
}
