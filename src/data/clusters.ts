/**
 * 핀 에디터(/map-editor) 에서 export 한 데이터.
 * 이 파일을 통째로 교체해도 무방.
 */
import type { BoothCluster } from '../types/cluster';

export const CLUSTERS_DATA: BoothCluster[] = [
  {
    id: 'cluster-cs',
    category: 'cluster',
    name: '지능형SW융합대학',
    collegeKey: 'ICT',
    coords: { x: 0.3585, y: 0.5452 },
    boothIds: [],
  },
  {
    id: 'cluster-business',
    category: 'cluster',
    name: '혁신공과대학',
    collegeKey: 'ENGINEERING',
    coords: { x: 0.4092, y: 0.6881 },
    boothIds: ['booth-002'],
  },
  {
    id: 'cluster-pe',
    category: 'cluster',
    name: '경영공학대학',
    collegeKey: 'BUSINESS',
    coords: { x: 0.3612, y: 0.6228 },
    boothIds: ['booth-003'],
  },
  {
    id: 'cluster-psych',
    category: 'cluster',
    name: '인문사회융합대학',
    collegeKey: 'HUMANITIES',
    coords: { x: 0.6357, y: 0.5464 },
    boothIds: ['booth-004'],
  },
  {
    id: 'cluster-1777595166098',
    category: 'cluster',
    name: '디자인앤아트대학',
    collegeKey: 'DESIGN',
    coords: { x: 0.5412, y: 0.7053 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611130350',
    category: 'cluster',
    name: '라이프케어사이언스대학',
    collegeKey: 'LIFE',
    coords: { x: 0.6352, y: 0.6298 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611164386',
    category: 'cluster',
    name: '음악테크놀로지대학',
    collegeKey: 'MUSIC',
    coords: { x: 0.6359, y: 0.4685 },
    boothIds: [],
  },
];
