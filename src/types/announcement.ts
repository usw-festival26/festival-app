/**
 * 공지사항 관련 타입 정의
 */

/** 공지 우선순위 */
export type AnnouncementPriority = 'urgent' | 'normal' | 'low';

/** 공지사항 */
export interface Announcement {
  id: string;
  /** 공지 제목 */
  title: string;
  /** 본문 내용 */
  content: string;
  /** 게시 시각 (ISO 8601) */
  publishedAt: string;
  /** 우선순위 */
  priority: AnnouncementPriority;
  /** 상단 고정 여부 */
  isPinned: boolean;
  /** 작성자 (선택) */
  author?: string;
}
