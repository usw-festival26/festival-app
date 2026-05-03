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
    coords: { x: 0.2861, y: 0.5597 },
    boothIds: ['booth-001'],
  },
  {
    id: 'cluster-business',
    category: 'cluster',
    name: '공과대학',
    coords: { x: 0.3756, y: 0.8901 },
    boothIds: ['booth-002'],
  },
  {
    id: 'cluster-pe',
    category: 'cluster',
    name: '경상대학',
    coords: { x: 0.2886, y: 0.7091 },
    boothIds: ['booth-003'],
  },
  {
    id: 'cluster-psych',
    category: 'cluster',
    name: '인문사회융합대학',
    coords: { x: 0.7289, y: 0.6475 },
    boothIds: ['booth-004'],
  },
  {
    id: 'cluster-1777595166098',
    category: 'cluster',
    name: '미술대학',
    coords: { x: 0.5995, y: 0.9106 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611130350',
    category: 'cluster',
    name: '라이프케어사이언스대학',
    coords: { x: 0.7164, y: 0.7949 },
    boothIds: [],
  },
  {
    id: 'cluster-1777611164386',
    category: 'cluster',
    name: '음악대학',
    coords: { x: 0.7139, y: 0.5037 },
    boothIds: [],
  },
];
