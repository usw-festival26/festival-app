/**
 * 공지사항 하드코딩 데이터
 */
import type { Announcement } from '../types/announcement';

export const ANNOUNCEMENTS_DATA: Announcement[] = [
  {
    id: 'notice-001',
    title: '2026 USW 축제 안내',
    content:
      '2026 USW 대학 축제가 5월 20일~21일 이틀간 진행됩니다. 많은 참여 바랍니다!',
    publishedAt: '2026-05-15T10:00:00+09:00',
    priority: 'urgent',
    isPinned: true,
    author: '축제준비위원회',
  },
  {
    id: 'notice-002',
    title: '주차 안내',
    content:
      '축제 기간 중 교내 주차가 제한됩니다. 대중교통을 이용해 주세요. 셔틀버스가 정문에서 10분 간격으로 운행합니다.',
    publishedAt: '2026-05-18T14:00:00+09:00',
    priority: 'normal',
    isPinned: false,
    author: '총학생회',
  },
  {
    id: 'notice-003',
    title: '우천 시 일정 변경 안내',
    content:
      '우천 시 야외 공연은 체육관으로 장소가 변경됩니다. 변경 사항은 이 앱에서 실시간으로 안내드립니다.',
    publishedAt: '2026-05-19T09:00:00+09:00',
    priority: 'normal',
    isPinned: false,
    author: '운영팀',
  },
  {
    id: 'notice-004',
    title: '분실물 보관 안내',
    content:
      '축제 중 분실물은 본부 천막(중앙광장 옆)에서 보관합니다. 분실물 조회는 앱의 "분실물" 탭에서 확인하세요.',
    publishedAt: '2026-05-20T08:00:00+09:00',
    priority: 'low',
    isPinned: false,
    author: '운영팀',
  },
];
