/**
 * 분실물 관련 타입 정의
 */

/** 분실물 상태 */
export type LostFoundStatus = 'lost' | 'found' | 'claimed';

/** 분실물 카테고리 */
export type LostFoundCategory =
  | 'electronics'
  | 'clothing'
  | 'accessories'
  | 'bags'
  | 'other';

/** 분실물 항목 */
export interface LostFoundItem {
  id: string;
  /** 물품 이름 */
  title: string;
  /** 상세 설명 */
  description: string;
  /** 발견/분실 장소. 백엔드 스펙에 storageLocation 이 없어 optional. */
  location?: string;
  /** 현재 상태 */
  status: LostFoundStatus;
  /** 신고 시각 (ISO 8601). 백엔드 스펙에 createdAt 이 없어 optional. */
  reportedAt?: string;
  /** 물품 이미지 URI (선택) */
  imageUri?: string;
  /** 물품 카테고리 */
  category: LostFoundCategory;
}
