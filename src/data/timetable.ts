/**
 * 공연 타임테이블 하드코딩 데이터
 *
 * 공연 일정을 추가/수정하려면 이 파일만 편집하면 됩니다.
 * - stages: 무대 목록 (id, 이름, 위치, 색상)
 * - days: 날짜별 공연 목록
 *
 * 시간은 반드시 ISO 8601 + KST(+09:00) 형식으로 작성합니다.
 * 예: "2026-05-20T17:00:00+09:00"
 */
import type { TimetableData } from '../types/timetable';

export const TIMETABLE_DATA: TimetableData = {
  stages: [
    {
      id: 'main-stage',
      name: '메인 무대',
      location: '중앙광장',
      color: '#FF6B6B',
    },
    {
      id: 'sub-stage',
      name: '서브 무대',
      location: '잔디광장',
      color: '#4ECDC4',
    },
    {
      id: 'busking-zone',
      name: '버스킹존',
      location: '후문 앞',
      color: '#FFE66D',
    },
  ],

  days: [
    {
      date: '2026-05-20',
      label: 'Day 1 - 수요일',
      performances: [
        {
          id: 'perf-001',
          artistName: '오프닝 세레모니',
          description: '2026 USW 축제 개막식',
          stageId: 'main-stage',
          startTime: '2026-05-20T17:00:00+09:00',
          endTime: '2026-05-20T17:30:00+09:00',
          category: 'ceremony',
        },
        {
          id: 'perf-002',
          artistName: '밴드 A',
          description: '컴퓨터공학과 밴드 동아리 공연',
          stageId: 'main-stage',
          startTime: '2026-05-20T17:30:00+09:00',
          endTime: '2026-05-20T18:30:00+09:00',
          category: 'band',
        },
        {
          id: 'perf-003',
          artistName: '댄스 크루 B',
          description: '중앙 댄스 동아리 공연',
          stageId: 'sub-stage',
          startTime: '2026-05-20T17:00:00+09:00',
          endTime: '2026-05-20T18:00:00+09:00',
          category: 'dance',
        },
        {
          id: 'perf-004',
          artistName: '어쿠스틱 듀오 C',
          description: '감성 어쿠스틱 버스킹',
          stageId: 'busking-zone',
          startTime: '2026-05-20T18:00:00+09:00',
          endTime: '2026-05-20T19:00:00+09:00',
          category: 'solo',
        },
        {
          id: 'perf-005',
          artistName: 'DJ Night',
          description: '첫날 밤 DJ 파티',
          stageId: 'main-stage',
          startTime: '2026-05-20T20:00:00+09:00',
          endTime: '2026-05-20T22:00:00+09:00',
          category: 'dj',
        },
      ],
    },
    {
      date: '2026-05-21',
      label: 'Day 2 - 목요일',
      performances: [
        {
          id: 'perf-006',
          artistName: '코미디 쇼',
          description: '연극영화과 코미디 공연',
          stageId: 'sub-stage',
          startTime: '2026-05-21T16:00:00+09:00',
          endTime: '2026-05-21T17:00:00+09:00',
          category: 'comedy',
        },
        {
          id: 'perf-007',
          artistName: '밴드 D',
          description: '경영학과 밴드 동아리',
          stageId: 'main-stage',
          startTime: '2026-05-21T17:00:00+09:00',
          endTime: '2026-05-21T18:00:00+09:00',
          category: 'band',
        },
        {
          id: 'perf-008',
          artistName: '헤드라이너 가수',
          description: '초청 가수 공연',
          stageId: 'main-stage',
          startTime: '2026-05-21T20:00:00+09:00',
          endTime: '2026-05-21T21:30:00+09:00',
          category: 'solo',
        },
        {
          id: 'perf-009',
          artistName: '클로징 세레모니',
          description: '2026 USW 축제 폐막식',
          stageId: 'main-stage',
          startTime: '2026-05-21T21:30:00+09:00',
          endTime: '2026-05-21T22:00:00+09:00',
          category: 'ceremony',
        },
      ],
    },
  ],
};
