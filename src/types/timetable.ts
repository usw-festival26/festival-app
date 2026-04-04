/**
 * 공연 타임테이블 관련 타입 정의
 *
 * 축제 공연 일정은 프론트엔드에서 하드코딩하여 관리합니다.
 * 데이터는 src/data/timetable.ts 에서 확인/수정할 수 있습니다.
 */

/** 공연 카테고리 */
export type PerformanceCategory =
  | 'band'
  | 'dance'
  | 'solo'
  | 'dj'
  | 'comedy'
  | 'ceremony'
  | 'other';

/** 개별 공연 정보 */
export interface Performance {
  /** 고유 식별자 */
  id: string;
  /** 아티스트/팀 이름 */
  artistName: string;
  /** 공연 설명 */
  description: string;
  /** 무대 ID (Stage.id와 매칭) */
  stageId: string;
  /** 시작 시각 (ISO 8601, 예: "2026-05-20T17:00:00+09:00") */
  startTime: string;
  /** 종료 시각 (ISO 8601) */
  endTime: string;
  /** 공연 카테고리 */
  category: PerformanceCategory;
  /** 썸네일 이미지 URI (선택) */
  imageUri?: string;
}

/** 무대 정보 */
export interface Stage {
  id: string;
  /** 무대 이름 (예: "메인 무대") */
  name: string;
  /** 위치 설명 (예: "중앙광장") */
  location: string;
  /** UI에서 사용할 대표 색상 (hex) */
  color: string;
}

/** 축제 하루치 일정 */
export interface TimetableDay {
  /** 날짜 (ISO date, 예: "2026-05-20") */
  date: string;
  /** 표시 라벨 (예: "Day 1 - 수요일") */
  label: string;
  /** 해당 날짜의 공연 목록 */
  performances: Performance[];
}

/** 전체 타임테이블 데이터 */
export interface TimetableData {
  stages: Stage[];
  days: TimetableDay[];
}
