/**
 * 핀 에디터(/map-editor) 에서 export 한 데이터.
 * 이 파일을 통째로 교체해도 무방.
 */
import type { FoodPin } from '../types/cluster';

export const FOOD_PINS_DATA: FoodPin[] = [
  {
    // boothId 제거 — 이전엔 booth-001(떡볶이 천국, 하드코딩) 로 push 되던 동작이
    // 의도와 다름. 푸드트럭2 처럼 시트/지도 정보만 노출되도록 entity 연결 해제.
    id: 'food-pin-001',
    category: 'food',
    name: '푸드트럭1',
    coords: { x: 0.1260, y: 0.5164 },
    description: '떡볶이',
  },
  {
    id: 'food-1777611189681',
    category: 'food',
    name: '푸드트럭2',
    coords: { x: 0.1277, y: 0.6178 },
  },
];
