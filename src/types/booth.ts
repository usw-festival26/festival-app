/**
 * 부스 관련 타입 정의
 *
 * 부스 위치, 설명, 메뉴 정보를 관리합니다.
 *
 * 백엔드(swagger BoothResponse)는 boothId/name/imageUrl 만 제공하므로
 * 그 외 필드는 detail 응답이나 별도 호출(useBoothMenus)로 보강된다 → 모두 optional.
 */

/** 부스 카테고리 */
export type BoothCategory =
  | 'food'
  | 'drink'
  | 'game'
  | 'experience'
  | 'merchandise'
  | 'other';

/** 부스 메뉴 아이템 */
export interface BoothMenuItem {
  id: string;
  /** 메뉴 이름 */
  name: string;
  /** 메뉴 설명 (선택) */
  description?: string;
  /** 가격 (원) */
  price: number;
  /** 판매 가능 여부 */
  isAvailable: boolean;
  /** 메뉴 이미지 URI (선택) */
  imageUri?: string;
  /** 메뉴 분류 (선택) */
  menuCategory?: 'main' | 'side' | 'set';
}

/** 부스 정보 */
export interface Booth {
  id: string;
  /** 부스 이름 */
  name: string;
  /** 운영 주체 (동아리, 학과 등) — 백엔드 미제공 시 undefined */
  organizer?: string;
  /** 부스 설명 — list 응답에는 없고 detail 에서만 채워짐 */
  description?: string;
  /** 위치 설명 — 백엔드 미제공 시 undefined */
  location?: string;
  /** 부스 카테고리 — 백엔드 미제공 시 undefined */
  category?: BoothCategory;
  /** 부스 메뉴 목록 — 별도 호출(useBoothMenus)로 받는 게 기본, 하드코딩 fixture 만 동봉 */
  menuItems?: BoothMenuItem[];
  /** 부스 이미지 URI (선택) */
  imageUri?: string;
  /** 부스 공지 (선택) */
  notice?: string;
}
