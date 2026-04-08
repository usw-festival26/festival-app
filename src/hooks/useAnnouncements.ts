/**
 * 공지사항 데이터 접근 훅
 */
import { useMemo, useState, useEffect } from 'react';
import { config } from '@config/env';
import { fetchAnnouncements, fetchAnnouncement } from '@api/endpoints';
import { ANNOUNCEMENTS_DATA } from '../data/announcements';
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

  const source = apiData ?? ANNOUNCEMENTS_DATA;

  const announcements = useMemo(() => {
    return [...source].sort((a, b) => {
      // 고정 공지 우선, 그 다음 최신순
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [source]);

  return { announcements, isLoading, error };
}

export function useAnnouncementById(id: string): {
  announcement: Announcement | undefined;
  isLoading: boolean;
  error: string | null;
} {
  const [apiData, setApiData] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    fetchAnnouncement(id)
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const announcement = useMemo(() => {
    if (apiData) return apiData;
    return ANNOUNCEMENTS_DATA.find((a) => a.id === id);
  }, [apiData, id]);

  return { announcement, isLoading, error };
}
