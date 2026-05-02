/**
 * 공지사항 관련 타입 정의
 *
 * 백엔드(swagger NoticeResponse)는 noticeId/title/pinned/createdAt 을 제공.
 * content 는 detail 응답에서 항상, list 응답에서도 함께 내려오는 케이스가 있어
 * Announcement.content 는 optional. 화면은 list 본문이 있으면 즉시 사용, 없으면
 * detail 페치로 폴백.
 * priority/author 는 백엔드 미제공 → optional (UI 가 fallback 처리).
 */

/** 공지 우선순위 */
export type AnnouncementPriority = 'urgent' | 'normal' | 'low';

/** 공지사항 */
export interface Announcement {
  id: string;
  /** 공지 제목 */
  title: string;
  /** 본문 내용 — list 응답에 포함되면 즉시 사용, 없으면 detail 페치로 채움 */
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
