/**
 * 지도 핀 관련 타입.
 *
 * Booth 자체는 좌표를 갖지 않는다. 단과대 그룹(BoothCluster) 이 좌표를 가지고
 * 여러 Booth 를 묶어 하나의 핀으로 표시한다. 푸드/편의는 별도 핀 entity.
 *
 * 백엔드가 향후 단과대 그룹 응답을 제공하면 mapCluster 매퍼로 변환해
 * CLUSTERS_DATA 자리에 주입할 예정 (현재는 하드코딩만).
 */
import type { MapCoords } from './map';
import type { BackendCollege } from '../api/types';

/** 핀 카테고리 — 셰입은 동일하고 색만 분기한다. */
export type PinCategory = 'cluster' | 'food' | 'facility';

/** 좌표를 가진 모든 핀의 공통 인터페이스. */
export interface Pinnable {
  id: string;
  category: PinCategory;
  coords: MapCoords;
}

/** 단과대(또는 임의 그룹) 부스 묶음 핀. */
export interface BoothCluster extends Pinnable {
  category: 'cluster';
  /** 단과대명 등 그룹명 (핀 첫 줄) */
  name: string;
  /**
   * 이 클러스터가 자동으로 흡수할 부스의 단과대 enum.
   * 백엔드가 booth.college 를 채우면 booth.collegeKey 와 일치하는 부스가 자동 귀속.
   * 동아리/특수 그룹 등 단과대 enum 으로 표현 못 하는 클러스터는 undefined.
   */
  collegeKey?: BackendCollege;
  /**
   * 수동 등록 booth.id 목록 — collegeKey 매칭으로 잡히지 않는 케이스(동아리,
   * 외부 운영진 booth 등) 의 fallback. useBooths().booths 에서 조회.
   */
  boothIds: string[];
}

/** 푸드 부스 핀 — 부스 상세 라우트 재사용 가능. */
export interface FoodPin extends Pinnable {
  category: 'food';
  /** 푸드 부스 표시명 */
  name: string;
  /** 부스 상세 라우트(/booth/[id]) 매핑용. 없으면 시트에 단순 정보만 표시. */
  boothId?: string;
  description?: string;
}

/**
 * 편의시설 핀 — entity 자체.
 * 별도 FACILITIES_DATA 가 따로 있지 않고 핀이 곧 facility 엔트리다.
 * 시트 표시는 FACILITY_PINS_DATA 에서 추출해 만든다.
 */
export interface FacilityPin extends Pinnable {
  category: 'facility';
  /** 시설명 (예: "본관 화장실", "정문 안내데스크") */
  name: string;
  /** 연락처 (예: "02-1234-5678"). 빈 문자열 가능. */
  phone: string;
}

/** 핀 카테고리 ↔ 한글 레이블 */
export const PIN_CATEGORY_LABELS: Record<PinCategory, string> = {
  cluster: '단과대',
  food: '푸드',
  facility: '편의',
};
