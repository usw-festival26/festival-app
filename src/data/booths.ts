/**
 * 부스 하드코딩 데이터
 *
 * 부스 정보를 추가/수정하려면 이 파일만 편집하면 됩니다.
 */
import type { Booth } from '../types/booth';

export const BOOTHS_DATA: Booth[] = [
  {
    id: 'booth-001',
    name: '떡볶이 천국',
    organizer: '컴퓨터공학과',
    description: '매콤한 떡볶이와 튀김을 판매합니다.',
    location: 'A구역 1번',
    category: 'food',
    menuItems: [
      { id: 'menu-001', name: '떡볶이', price: 4000, isAvailable: true, menuCategory: 'main' },
      { id: 'menu-002', name: '모듬튀김', price: 3000, isAvailable: true, menuCategory: 'side' },
      { id: 'menu-003', name: '순대', price: 4000, isAvailable: false, menuCategory: 'side' },
    ],
  },
  {
    id: 'booth-002',
    name: '칵테일 바',
    organizer: '경영학과',
    description: '다양한 논알콜 칵테일을 제공합니다.',
    location: 'A구역 3번',
    category: 'drink',
    menuItems: [
      { id: 'menu-004', name: '모히또', price: 3500, isAvailable: true, menuCategory: 'main' },
      { id: 'menu-005', name: '블루레몬에이드', price: 3000, isAvailable: true, menuCategory: 'main' },
    ],
  },
  {
    id: 'booth-003',
    name: '사격 게임',
    organizer: '체육학과',
    description: '에어건 사격 게임! 상품이 걸려있어요.',
    location: 'B구역 2번',
    category: 'game',
    menuItems: [
      { id: 'menu-006', name: '1회 도전', price: 2000, isAvailable: true, menuCategory: 'main' },
      { id: 'menu-007', name: '3회 패키지', price: 5000, isAvailable: true, menuCategory: 'set' },
    ],
  },
  {
    id: 'booth-004',
    name: '타로 카페',
    organizer: '심리학과',
    description: '타로 상담과 함께 커피를 즐겨보세요.',
    location: 'C구역 1번',
    category: 'experience',
    menuItems: [
      { id: 'menu-008', name: '타로 상담 + 커피', price: 5000, isAvailable: true, menuCategory: 'set' },
      { id: 'menu-009', name: '아이스 아메리카노', price: 2000, isAvailable: true, menuCategory: 'main' },
    ],
  },
  {
    id: 'booth-005',
    name: '굿즈샵',
    organizer: '총학생회',
    description: 'USW 축제 공식 굿즈를 판매합니다.',
    location: 'A구역 5번',
    category: 'merchandise',
    menuItems: [
      { id: 'menu-010', name: '축제 티셔츠', price: 15000, isAvailable: true, menuCategory: 'main' },
      { id: 'menu-011', name: '축제 에코백', price: 8000, isAvailable: true, menuCategory: 'main' },
      { id: 'menu-012', name: '축제 스티커 팩', price: 3000, isAvailable: true, menuCategory: 'side' },
    ],
  },
];
