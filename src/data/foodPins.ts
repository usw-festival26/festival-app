/**
 * 핀 에디터(/map-editor) 에서 export 한 데이터.
 * 이 파일을 통째로 교체해도 무방.
 */
import type { FoodPin } from '../types/cluster';

export const FOOD_PINS_DATA: FoodPin[] = [
  {
    id: 'food-pin-001',
    category: 'food',
    name: '푸드트럭1',
    boothId: 'booth-001',
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
