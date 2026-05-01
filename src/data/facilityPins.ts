/**
 * 편의시설 핀 하드코딩 데이터.
 *
 * 핀 = 편의시설 entity. 별도 FACILITIES_DATA 없음. 시트의 편의 리스트는
 * 이 배열에서 추출.
 *
 * 핀 에디터(/map-editor) 출력을 이 파일에 통째로 붙여넣으면 자동 반영.
 */
import type { FacilityPin } from '../types/cluster';

export const FACILITY_PINS_DATA: FacilityPin[] = [
  {
    id: 'facility-pin-001',
    category: 'facility',
    name: '의무실',
    phone: '02-1234-5678',
    coords: { x: 0.85, y: 0.2 },
  },
  {
    id: 'facility-pin-002',
    category: 'facility',
    name: '안내센터',
    phone: '02-1234-5679',
    coords: { x: 0.15, y: 0.2 },
  },
  {
    id: 'facility-pin-003',
    category: 'facility',
    name: '분실물센터',
    phone: '02-1234-5680',
    coords: { x: 0.85, y: 0.8 },
  },
  {
    id: 'facility-pin-004',
    category: 'facility',
    name: '화장실 안내',
    phone: '02-1234-5681',
    coords: { x: 0.15, y: 0.8 },
  },
];
