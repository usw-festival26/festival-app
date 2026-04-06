/**
 * 공지사항 하드코딩 데이터
 */
import type { Announcement } from '../types/announcement';

export const ANNOUNCEMENTS_DATA: Announcement[] = [
  {
    id: 'notice-001',
    title: '🎉 2026 USW 대동제 안내',
    content:
      '2026 USW 대동제가 5월 20일(수)~21일(목) 이틀간 교내 중앙광장 일대에서 열립니다. 다양한 부스, 공연, 먹거리가 준비되어 있으니 많은 관심과 참여 부탁드립니다!',
    publishedAt: '2026-05-15T10:00:00+09:00',
    priority: 'urgent',
    isPinned: true,
    author: '축제준비위원회',
  },
  {
    id: 'notice-002',
    title: '축제 기간 주차 및 교통 안내',
    content:
      '축제 기간(5/20~21) 중 교내 주차장 이용이 제한됩니다. 가급적 대중교통을 이용해 주세요. 정문에서 축제장까지 셔틀버스가 10분 간격으로 운행되오니 편하게 이용하시기 바랍니다.',
    publishedAt: '2026-05-18T14:00:00+09:00',
    priority: 'normal',
    isPinned: false,
    author: '총학생회',
  },
  {
    id: 'notice-003',
    title: '우천 시 일정 변경 안내',
    content:
      '비가 올 경우 야외 무대 공연은 체육관으로 장소가 변경됩니다. 일정 변경 사항은 본 앱 공지와 공식 SNS를 통해 실시간으로 안내드리겠습니다.',
    publishedAt: '2026-05-19T09:00:00+09:00',
    priority: 'normal',
    isPinned: false,
    author: '운영팀',
  },
  {
    id: 'notice-004',
    title: '분실물 보관 안내',
    content:
      '축제 중 분실물은 중앙광장 옆 본부 천막에서 보관하고 있습니다. 잃어버린 물건이 있다면 앱 하단의 \'분실물\' 탭에서 조회해 보세요.',
    publishedAt: '2026-05-20T08:00:00+09:00',
    priority: 'low',
    isPinned: false,
    author: '운영팀',
  },
];
