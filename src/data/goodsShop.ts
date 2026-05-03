/**
 * 굿즈샵 하드코딩 데이터
 *
 * Figma node 2047:725 — 첫 슬라이드 "농구복" + 페이지네이션 "1/3" 으로 노출되어
 * 최소 3개 항목이 필요. 이미지가 도착하기 전까지는 imageUri undefined 로 두고
 * GoodsCarouselCard 가 빈 박스(흰 배경 + 검정 보더)를 노출.
 */
import type { GoodsItem } from '../types/goods';

export const GOODS_ITEMS_DATA: GoodsItem[] = [
  {
    id: 'goods-001',
    title: '농구복',
  },
  {
    id: 'goods-002',
    title: '응원봉',
  },
  {
    id: 'goods-003',
    title: '에코백',
  },
];
