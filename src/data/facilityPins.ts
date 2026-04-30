/**
 * 편의시설 핀 하드코딩 데이터.
 *
 * 핀 에디터(/map-editor) 출력을 이 파일에 통째로 붙여넣으면 자동 반영.
 * facilityId 는 src/data/facilities.ts 의 FACILITIES_DATA 항목 id 와 매칭.
 */
import type { FacilityPin } from '../types/cluster';

export const FACILITY_PINS_DATA: FacilityPin[] = [
  {
    id: 'facility-pin-001',
    category: 'facility',
    facilityId: 'facility-001',
    coords: { x: 0.85, y: 0.20 },
  },
  {
    id: 'facility-pin-002',
    category: 'facility',
    facilityId: 'facility-002',
    coords: { x: 0.15, y: 0.20 },
  },
  {
    id: 'facility-pin-003',
    category: 'facility',
    facilityId: 'facility-003',
    coords: { x: 0.85, y: 0.80 },
  },
  {
    id: 'facility-pin-004',
    category: 'facility',
    facilityId: 'facility-004',
    coords: { x: 0.15, y: 0.80 },
  },
];
