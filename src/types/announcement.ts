/**
 * 공지사항 관련 타입 정의
 *
 * 백엔드(swagger NoticeResponse)는 noticeId/title/pinned/createdAt 만 제공.
 * content 는 detail 응답에서만, priority/author 는 백엔드 미제공 → optional.
 */

/** 공지 우선순위 */
export type AnnouncementPriority = 'urgent' | 'normal' | 'low';

/** 공지사항 */
export interface Announcement {
  id: string;
  /** 공지 제목 */
  title: string;
  /** 본문 내용 — list 에서는 비어있고 detail 에서만 채워짐 */
  content?: string;
  /** 게시 시각 (ISO 8601) */
  publishedAt: string;
  /** 우선순위 — 백엔드 미제공 시 undefined (UI 에서 미표시) */
  priority?: AnnouncementPriority;
  /** 상단 고정 여부 */
  isPinned: boolean;
  /** 작성자 (선택) */
  author?: string;
}
