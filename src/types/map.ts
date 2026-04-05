/**
 * 지도 화면 관련 타입
 *
 * 필터 카테고리별로 다른 데이터 형태를 사용합니다.
 */

/** 지도 필터 카테고리 */
export type MapFilterCategory = 'all' | 'booth' | 'food' | 'facility' | 'event';

/** 바텀시트 카테고리 (all 제외) */
export type SheetCategory = 'booth' | 'food' | 'facility' | 'event';

/** 필터 카테고리 ↔ 한글 레이블 매핑 */
export const MAP_FILTER_LABELS: Record<MapFilterCategory, string> = {
  all: '전체',
  booth: '부스',
  food: '푸드',
  facility: '편의',
  event: '행사',
};

/** 편의시설 정보 */
export interface Facility {
  id: string;
  name: string;
  phone: string;
  imageUri?: string;
}

/** 축제 이벤트/행사 */
export interface FestivalEvent {
  id: string;
  title: string;
  description: string;
  imageUri?: string;
}
