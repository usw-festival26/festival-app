/**
 * 부스 관련 타입 정의
 *
 * 부스 위치, 설명, 메뉴 정보를 관리합니다.
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
  /** 운영 주체 (동아리, 학과 등) */
  organizer: string;
  /** 부스 설명 */
  description: string;
  /** 위치 설명 */
  location: string;
  /** 부스 카테고리 */
  category: BoothCategory;
  /** 부스 메뉴 목록 */
  menuItems: BoothMenuItem[];
  /** 부스 이미지 URI (선택) */
  imageUri?: string;
}
