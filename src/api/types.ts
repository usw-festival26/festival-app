/**
 * 백엔드 API 응답 raw 타입 정의
 *
 * 프론트엔드 타입(src/types/)과 분리하여 백엔드 변경 시 영향 범위를 한정한다.
 * API 응답 → 프론트엔드 타입 변환은 mappers.ts에서 처리.
 */

// ── 공지 (Notices) ──────────────────────────────────────────
// 목록(NoticeResponse) 스키마상 content 미포함이지만 백엔드가 응답에 함께
// 내려주는 운영 케이스가 존재 → optional 로 받아 매퍼가 있으면 채운다.
// 목록에 content 가 있으면 상세 페치 없이 즉시 본문을 펼칠 수 있다.

export interface ApiNotice {
  noticeId: number;
  title: string;
  pinned: boolean;
  createdAt: string;
  content?: string;
}

export interface ApiNoticeDetail extends ApiNotice {
  content: string;
}

// ── 분실물 (Lost Items) ─────────────────────────────────────
// LostItemResponse: { lostItemId, name, status, category, imageUrl }
// LostItemDetailResponse: + description
// 스펙에 storageLocation / createdAt 없음 → LostFoundItem.location / reportedAt 은 optional 로 두고 훅/컴포넌트에서 가드.

export interface ApiLostItem {
  lostItemId: number;
  name: string;
  status: string;
  category: string;
  imageUrl: string;
}

export interface ApiLostItemDetail extends ApiLostItem {
  description: string;
}

// ── 부스 (Booths) ───────────────────────────────────────────

export interface ApiBooth {
  boothId: number;
  name: string;
  imageUrl: string;
}

export interface ApiBoothDetail extends ApiBooth {
  description: string;
  notice: string;
}

// ── 메뉴 (Menus) ───────────────────────────────────────────

export interface ApiMenu {
  menuId: number;
  name: string;
  price: number;
  imageUrl: string;
  status: string;
}
