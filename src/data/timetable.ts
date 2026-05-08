/**
 * 공연 타임테이블 데이터 (수동 입력 전용)
 *
 * 백엔드 API 연동 없이 이 파일을 편집해 배포한다.
 *
 * 편집 방법:
 * - stages: 무대 목록 (id, 이름, 위치, 색상)
 * - days[].performances: 각 날짜별 공연 목록
 * - 시간은 반드시 ISO 8601 + KST(+09:00) 형식으로 작성
 *   예: "2026-05-14T17:00:00+09:00"
 * - 포스터 이미지를 보여주려면 Performance.imageUri 필드에 URL 입력
 *
 * 편집 후 `npm run web` 으로 시각 확인 → 배포.
 *
 * 종료 시각은 보통 다음 공연 시작 시각. 18:10 선입장(10분짜리) 이후
 * 다음 공연(가요제/수원시그널)까지 20~30분 공백 — 무대 전환 + 입장 정리.
 * 마지막 공연(EDM 22:00)은 +1h.
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
      date: '2026-05-14',
      label: 'Day 1 - 목요일',
      performances: [
        {
          id: 'd1-001',
          artistName: '패션쇼',
          description: '학생 패션쇼',
          stageId: 'main-stage',
          startTime: '2026-05-14T15:30:00+09:00',
          endTime: '2026-05-14T16:00:00+09:00',
          category: 'other',
        },
        {
          id: 'd1-002',
          artistName: '플레이버',
          description: '학내 동아리 무대',
          stageId: 'main-stage',
          startTime: '2026-05-14T16:00:00+09:00',
          endTime: '2026-05-14T16:30:00+09:00',
          category: 'band',
        },
        {
          id: 'd1-003',
          artistName: '적토마',
          description: '학내 동아리 무대',
          stageId: 'main-stage',
          startTime: '2026-05-14T16:30:00+09:00',
          endTime: '2026-05-14T17:30:00+09:00',
          category: 'band',
        },
        {
          id: 'd1-004',
          artistName: '올어바웃',
          description: '학내 동아리 무대',
          stageId: 'main-stage',
          startTime: '2026-05-14T17:30:00+09:00',
          endTime: '2026-05-14T18:10:00+09:00',
          category: 'band',
        },
        {
          id: 'd1-005',
          artistName: '선입장',
          description: '입장 정리 시간',
          stageId: 'main-stage',
          startTime: '2026-05-14T18:10:00+09:00',
          endTime: '2026-05-14T18:20:00+09:00',
          category: 'other',
        },
        {
          id: 'd1-006',
          artistName: '가요제 및 무대 정리',
          description: '교내 가요제 및 무대 전환',
          stageId: 'main-stage',
          startTime: '2026-05-14T18:40:00+09:00',
          endTime: '2026-05-14T19:10:00+09:00',
          category: 'other',
        },
        {
          id: 'd1-007',
          artistName: 'TNX',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-14T19:10:00+09:00',
          endTime: '2026-05-14T19:45:00+09:00',
          category: 'band',
        },
        {
          id: 'd1-008',
          artistName: '크러쉬',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-14T19:45:00+09:00',
          endTime: '2026-05-14T20:30:00+09:00',
          category: 'solo',
        },
        {
          id: 'd1-009',
          artistName: '헤이즈',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-14T20:30:00+09:00',
          endTime: '2026-05-14T21:00:00+09:00',
          category: 'solo',
        },
        {
          id: 'd1-010',
          artistName: 'YB',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-14T21:00:00+09:00',
          endTime: '2026-05-14T22:00:00+09:00',
          category: 'band',
        },
        {
          id: 'd1-011',
          artistName: 'EDM',
          description: 'EDM 클로징 파티',
          stageId: 'main-stage',
          startTime: '2026-05-14T22:00:00+09:00',
          endTime: '2026-05-14T23:00:00+09:00',
          category: 'dj',
        },
      ],
    },
    {
      date: '2026-05-15',
      label: 'Day 2 - 금요일',
      performances: [
        {
          id: 'd2-001',
          artistName: '이클립스',
          description: '학내 동아리 무대',
          stageId: 'main-stage',
          startTime: '2026-05-15T15:30:00+09:00',
          endTime: '2026-05-15T16:10:00+09:00',
          category: 'band',
        },
        {
          id: 'd2-002',
          artistName: '도레샘',
          description: '학내 동아리 무대',
          stageId: 'main-stage',
          startTime: '2026-05-15T16:10:00+09:00',
          endTime: '2026-05-15T16:50:00+09:00',
          category: 'band',
        },
        {
          id: 'd2-003',
          artistName: '나래',
          description: '학내 동아리 무대',
          stageId: 'main-stage',
          startTime: '2026-05-15T16:50:00+09:00',
          endTime: '2026-05-15T17:30:00+09:00',
          category: 'band',
        },
        {
          id: 'd2-004',
          artistName: '울림소리',
          description: '학내 동아리 무대',
          stageId: 'main-stage',
          startTime: '2026-05-15T17:30:00+09:00',
          endTime: '2026-05-15T18:10:00+09:00',
          category: 'band',
        },
        {
          id: 'd2-005',
          artistName: '선입장',
          description: '입장 정리 시간',
          stageId: 'main-stage',
          startTime: '2026-05-15T18:10:00+09:00',
          endTime: '2026-05-15T18:20:00+09:00',
          category: 'other',
        },
        {
          id: 'd2-006',
          artistName: '수원시그널 및 무대 정리',
          description: '수원시그널 + 무대 전환',
          stageId: 'main-stage',
          startTime: '2026-05-15T18:50:00+09:00',
          endTime: '2026-05-15T19:30:00+09:00',
          category: 'other',
        },
        {
          id: 'd2-007',
          artistName: 'Keybeatz',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-15T19:30:00+09:00',
          endTime: '2026-05-15T20:00:00+09:00',
          category: 'dj',
        },
        {
          id: 'd2-008',
          artistName: '나우아임영',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-15T20:00:00+09:00',
          endTime: '2026-05-15T20:30:00+09:00',
          category: 'solo',
        },
        {
          id: 'd2-009',
          artistName: '김하온',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-15T20:30:00+09:00',
          endTime: '2026-05-15T21:00:00+09:00',
          category: 'solo',
        },
        {
          id: 'd2-010',
          artistName: '허예림',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-15T21:00:00+09:00',
          endTime: '2026-05-15T21:20:00+09:00',
          category: 'solo',
        },
        {
          id: 'd2-011',
          artistName: '싸이',
          description: '초청 아티스트 공연',
          stageId: 'main-stage',
          startTime: '2026-05-15T21:20:00+09:00',
          endTime: '2026-05-15T22:00:00+09:00',
          category: 'solo',
        },
        {
          id: 'd2-012',
          artistName: 'EDM',
          description: 'EDM 클로징 파티',
          stageId: 'main-stage',
          startTime: '2026-05-15T22:00:00+09:00',
          endTime: '2026-05-15T23:00:00+09:00',
          category: 'dj',
        },
      ],
    },
  ],
};
