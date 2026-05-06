/**
 * 핀 에디터(/map-editor) 에서 export 한 데이터.
 * 이 파일을 통째로 교체해도 무방.
 */
import type { FacilityPin } from '../types/cluster';

export const FACILITY_PINS_DATA: FacilityPin[] = [
  {
    id: 'facility-pin-001',
    category: 'facility',
    name: '총학생회',
    phone: '',
    coords: { x: 0.6965, y: 0.3989 },
  },
  {
    id: 'facility-pin-002',
    category: 'facility',
    name: '굿즈샵',
    phone: '',
    coords: { x: 0.2886, y: 0.3726 },
  },
  {
    id: 'facility-pin-003',
    category: 'facility',
    name: '화장실',
    phone: '',
    coords: { x: 0.6866, y: 0.8177 },
  },
];
