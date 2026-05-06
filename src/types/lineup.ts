/**
 * Lineup(아티스트) 타입 정의
 */
import type { ImageSourcePropType } from 'react-native';

/** 공연 일차 — 1일차 (2026-05-14) / 2일차 (2026-05-15). 타임테이블 매핑 기준. */
export type LineupDay = 1 | 2;

export interface Artist {
  id: string;
  name: string;
  info: string;
  /** 백엔드/외부 URL — 운영 모드에서 사용. */
  imageUrl?: string;
  /** 로컬 require() asset — fixture 모드에서 사용. */
  image?: ImageSourcePropType;
  /**
   * 무대 일차 — 타임테이블의 출연일 기준. /lineup?day=N 진입 시 필터링용.
   * 양일 출연이거나 미정인 경우 undefined.
   */
  day?: LineupDay;
}
