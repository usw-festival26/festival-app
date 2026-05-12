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
    coords: { x: 0.3595, y: 0.5026 },
    boothIds: [],
  },
  {
    id: 'cluster-business',
    category: 'cluster',
    name: '혁신공과대학',
    collegeKey: 'ENGINEERING',
    coords: { x: 0.4069, y: 0.6818 },
    boothIds: ['booth-002'],
  },
  {
    id: 'cluster-pe',
    category: 'cluster',
    name: '경영공학대학',
    collegeKey: 'BUSINESS',
    coords: { x: 0.3605, y: 0.5729 },
    boothIds: ['booth-003'],
  },
  {
    id: 'cluster-psych',
    category: 'cluster',
    name: '인문사회융합대학',
    collegeKey: 'HUMANITIES',
    coords: { x: 0.6368, y: 0.5575 },
    boothIds: ['booth-004'],
  },
  {
    id: 'cluster-1777595166098',
    category: 'cluster',
    name: '디자인앤아트대학',
    collegeKey: 'DESIGN',
    coords: { x: 0.6362, y: 0.6374 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611130350',
    category: 'cluster',
    name: '라이프케어사이언스대학',
    collegeKey: 'LIFE',
    coords: { x: 0.5278, y: 0.7048 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611164386',
    category: 'cluster',
    name: '음악테크놀로지대학',
    collegeKey: 'MUSIC',
    coords: { x: 0.6404, y: 0.4890 },
    boothIds: [],
  },
];
