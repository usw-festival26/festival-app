/**
 * 축제 이벤트/행사 하드코딩 데이터
 */
import type { FestivalEvent } from '../types/map';

export const EVENTS_DATA: FestivalEvent[] = [
  {
    id: 'event-001',
    title: '축제 스탬프 투어',
    description: '부스를 돌며 스탬프를 모아 경품을 받아가세요!',
  },
  {
    id: 'event-002',
    title: '포토존 이벤트',
    description: '인생샷을 찍고 SNS에 공유하면 선물을 드려요.',
  },
  {
    id: 'event-003',
    title: '대동제 OX 퀴즈',
    description: '학교에 대한 OX 퀴즈! 최후의 1인에게 상품 증정.',
  },
  {
    id: 'event-004',
    title: '응원전',
    description: '학과별 응원 대항전, 최고의 응원을 선보여주세요!',
  },
];
