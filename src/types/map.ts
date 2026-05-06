/**
 * 지도 화면 관련 타입
 *
 * 필터 카테고리별로 다른 데이터 형태를 사용합니다.
 */
import type { ImageSourcePropType } from 'react-native';

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

/**
 * 지도 좌표 — 정규화(0~1) 형식.
 * x = 가로 비율, y = 세로 비율 (이미지 좌상단 = (0, 0)).
 * 이미지 해상도가 바뀌어도 핀 데이터를 유지하기 위해 픽셀이 아닌 비율로 저장한다.
 */
export interface MapCoords {
  x: number;
  y: number;
}

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
  /** 백엔드/외부 단일 이미지 URL — 운영 모드용. */
  imageUri?: string;
  /**
   * 로컬 require() asset 다중 이미지 — 라이트박스 모달 carousel 용.
   * 첫 번째 이미지가 홈 카드 썸네일.
   */
  images?: ImageSourcePropType[];
}
