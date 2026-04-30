/**
 * 푸드 부스 핀 하드코딩 데이터.
 *
 * 핀 에디터(/map-editor) 출력을 이 파일에 통째로 붙여넣으면 자동 반영.
 * boothId 가 있으면 핀 클릭 시 /booth/[id] 라우트로 이동하고, 없으면 시트에
 * 단순 정보만 표시한다.
 */
import type { FoodPin } from '../types/cluster';

export const FOOD_PINS_DATA: FoodPin[] = [
  {
    id: 'food-pin-001',
    category: 'food',
    name: '떡볶이 천국',
    boothId: 'booth-001',
    coords: { x: 0.20, y: 0.30 },
  },
  {
    id: 'food-pin-002',
    category: 'food',
    name: '굿즈샵',
    boothId: 'booth-005',
    coords: { x: 0.75, y: 0.65 },
  },
];
