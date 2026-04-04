/**
 * 공지사항 데이터 접근 훅
 */
import { useMemo } from 'react';
import { ANNOUNCEMENTS_DATA } from '../data/announcements';
import type { Announcement } from '../types/announcement';

export function useAnnouncements() {
  const announcements = useMemo(() => {
    return [...ANNOUNCEMENTS_DATA].sort((a, b) => {
      // 고정 공지 우선, 그 다음 최신순
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, []);

  return { announcements, isLoading: false };
}

export function useAnnouncementById(id: string): {
  announcement: Announcement | undefined;
  isLoading: boolean;
} {
  const announcement = useMemo(
    () => ANNOUNCEMENTS_DATA.find((a) => a.id === id),
    [id],
  );
  return { announcement, isLoading: false };
}
