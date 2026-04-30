/**
 * 단과대 그룹 클러스터 핀 하드코딩 데이터.
 *
 * 핀 에디터(/map-editor) 에서 출력한 TS 코드를 이 파일에 통째로 붙여넣으면
 * 자동 반영된다. 직접 편집해도 무방.
 *
 * 백엔드의 단과대 그룹 응답이 도입되면 mapCluster 매퍼 + useClusters 의
 * config.isApiEnabled 분기를 통해 fallback 으로만 사용된다.
 */
import type { BoothCluster } from '../types/cluster';

export const CLUSTERS_DATA: BoothCluster[] = [
  {
    id: 'cluster-cs',
    category: 'cluster',
    name: '컴퓨터공학과',
    coords: { x: 0.30, y: 0.45 },
    boothIds: ['booth-001'],
  },
  {
    id: 'cluster-business',
    category: 'cluster',
    name: '경영학과',
    coords: { x: 0.50, y: 0.50 },
    boothIds: ['booth-002'],
  },
  {
    id: 'cluster-pe',
    category: 'cluster',
    name: '체육학과',
    coords: { x: 0.65, y: 0.40 },
    boothIds: ['booth-003'],
  },
  {
    id: 'cluster-psych',
    category: 'cluster',
    name: '심리학과',
    coords: { x: 0.40, y: 0.60 },
    boothIds: ['booth-004'],
  },
];
