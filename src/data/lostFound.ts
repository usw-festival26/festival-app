/**
 * 분실물 하드코딩 데이터
 */
import type { LostFoundItem } from '../types/lostFound';

export const LOST_FOUND_DATA: LostFoundItem[] = [
  {
    id: 'lf-001',
    title: '에어팟 프로',
    description: '흰색 에어팟 프로, 케이스에 스티커 부착',
    location: '메인 무대 앞',
    status: 'found',
    reportedAt: '2026-05-20T19:30:00+09:00',
    category: 'electronics',
  },
  {
    id: 'lf-002',
    title: '검정 후드집업',
    description: 'L사이즈 검정 후드집업, 주머니에 학생증 있음',
    location: '잔디광장 벤치',
    status: 'found',
    reportedAt: '2026-05-20T20:15:00+09:00',
    category: 'clothing',
  },
  {
    id: 'lf-003',
    title: '갤럭시 S25',
    description: '파란색 케이스의 갤럭시 S25',
    location: 'A구역 부스 근처',
    status: 'claimed',
    reportedAt: '2026-05-20T18:00:00+09:00',
    category: 'electronics',
  },
  {
    id: 'lf-004',
    title: '캔버스 토트백',
    description: '베이지색 캔버스 토트백, 내부에 교재와 필통',
    location: 'C구역 벤치',
    status: 'found',
    reportedAt: '2026-05-21T14:00:00+09:00',
    category: 'bags',
  },
];
