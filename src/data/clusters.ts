/**
 * 핀 에디터(/map-editor) 에서 export 한 데이터.
 * 이 파일을 통째로 교체해도 무방.
 *
 * boothIds 형식 주의: 백엔드 API 의 booth.id 는 number 를 stringify 한 값(예: '1')
 * 이고, 로컬 fixture(BOOTHS_DATA) 는 'booth-001' 형식이다. cluster.boothIds 는
 * 두 형식을 모두 포함시켜 API/로컬 어느 모드에서도 매칭이 되도록 한다.
 * (장기적으로는 booth.college === cluster.name 매칭이 1순위가 되며 boothIds 는
 *  fallback 으로만 사용 — booth/index.tsx 의 visibleBooths 참조.)
 */
import type { BoothCluster } from '../types/cluster';

export const CLUSTERS_DATA: BoothCluster[] = [
  {
    id: 'cluster-cs',
    category: 'cluster',
    name: '지능형SW융합대학',
    collegeKey: 'ICT',
    coords: { x: 0.2861, y: 0.5597 },
    // 백엔드 API booth.college 가 채워지면 collegeKey 매칭으로 자동 귀속.
    // 그 전까지는 boothIds 수동 리스트가 fallback.
    boothIds: ['1', '2', '3', '4'],
  },
  {
    id: 'cluster-business',
    category: 'cluster',
    name: '공과대학',
    collegeKey: 'ENGINEERING',
    coords: { x: 0.3756, y: 0.8901 },
    boothIds: ['booth-002'],
  },
  {
    id: 'cluster-pe',
    category: 'cluster',
    name: '경상대학',
    collegeKey: 'BUSINESS',
    coords: { x: 0.2886, y: 0.7091 },
    boothIds: ['booth-003'],
  },
  {
    id: 'cluster-psych',
    category: 'cluster',
    name: '인문사회융합대학',
    collegeKey: 'HUMANITIES',
    coords: { x: 0.7289, y: 0.6475 },
    boothIds: ['booth-004'],
  },
  {
    id: 'cluster-1777595166098',
    category: 'cluster',
    name: '미술대학',
    collegeKey: 'DESIGN',
    coords: { x: 0.5995, y: 0.9106 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611130350',
    category: 'cluster',
    name: '라이프케어사이언스대학',
    collegeKey: 'LIFE',
    coords: { x: 0.7164, y: 0.7949 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611164386',
    category: 'cluster',
    name: '음악대학',
    collegeKey: 'MUSIC',
    coords: { x: 0.7139, y: 0.5037 },
    boothIds: [],
  },
];
