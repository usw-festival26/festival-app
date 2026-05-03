/**
 * 백엔드 API 응답 raw 타입 정의
 *
 * 프론트엔드 타입(src/types/)과 분리하여 백엔드 변경 시 영향 범위를 한정한다.
 * API 응답 → 프론트엔드 타입 변환은 mappers.ts에서 처리.
 */

// ── 공지 (Notices) ──────────────────────────────────────────
// swagger(2026-05) 에서 NoticeResponse 가 content 를 정식 필드로 포함하면서
// /api/notices/{id} 단일 조회 엔드포인트가 제거됐다. 따라서 ApiNoticeDetail 은
// 더 이상 필요 없고 ApiNotice 한 타입으로 list/detail 모두 커버한다.

export interface ApiNotice {
  noticeId: number;
  title: string;
  pinned: boolean;
  createdAt: string;
  content?: string;
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
// 백엔드 BoothResponse / BoothDetailResponse 양쪽 모두 college (enum) +
// collegeLabel (한글, 선택) 을 내려준다. enum 은 안정적, label 은 운영 변경에 따라
// 갱신될 수 있어 둘 다 받아두고 매퍼에서 라벨 우선순위 결정 (resolveCollegeLabel 참조).

export type BackendCollege =
  | 'HUMANITIES'
  | 'BUSINESS'
  | 'LIFE'
  | 'ICT'
  | 'DESIGN'
  | 'MUSIC'
  | 'ENGINEERING';

export interface ApiBooth {
  boothId: number;
  name: string;
  imageUrl: string;
  college?: BackendCollege;
  collegeLabel?: string;
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
