/**
 * 백엔드 API 응답 raw 타입 정의
 *
 * 프론트엔드 타입(src/types/)과 분리하여 백엔드 변경 시 영향 범위를 한정한다.
 * API 응답 → 프론트엔드 타입 변환은 mappers.ts에서 처리.
 */

// ── 공지 (Notices) ──────────────────────────────────────────

export interface ApiNotice {
  noticeId: number;
  title: string;
  pinned: boolean;
  createdAt: string;
}

export interface ApiNoticeDetail extends ApiNotice {
  content: string;
}

// ── 분실물 (Lost Items) ─────────────────────────────────────
// LostItemResponse: { lostItemId, name, status, category, imageUrl }
// LostItemDetailResponse: + description
// 스펙에 storageLocation / createdAt 없음 (UI LostFoundItem.location/reportedAt 은 mapper 에서 빈 값 처리).

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
