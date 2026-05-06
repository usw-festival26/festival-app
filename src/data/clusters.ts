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
    coords: { x: 0.2869, y: 0.5061 },
    boothIds: ['booth-001'],
  },
  {
    id: 'cluster-business',
    category: 'cluster',
    name: '공과대학',
    collegeKey: 'ENGINEERING',
    coords: { x: 0.3532, y: 0.6735 },
    boothIds: ['booth-002'],
  },
  {
    id: 'cluster-pe',
    category: 'cluster',
    name: '경상대학',
    collegeKey: 'BUSINESS',
    coords: { x: 0.2819, y: 0.5847 },
    boothIds: ['booth-003'],
  },
  {
    id: 'cluster-psych',
    category: 'cluster',
    name: '인문사회융합대학',
    collegeKey: 'HUMANITIES',
    coords: { x: 0.7065, y: 0.5686 },
    boothIds: ['booth-004'],
  },
  {
    id: 'cluster-1777595166098',
    category: 'cluster',
    name: '미술대학',
    collegeKey: 'DESIGN',
    coords: { x: 0.6949, y: 0.6388 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611130350',
    category: 'cluster',
    name: '라이프케어사이언스대학',
    collegeKey: 'LIFE',
    coords: { x: 0.5688, y: 0.6987 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611164386',
    category: 'cluster',
    name: '음악대학',
    collegeKey: 'MUSIC',
    coords: { x: 0.7081, y: 0.4821 },
    boothIds: [],
  },
];
