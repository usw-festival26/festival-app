/**
 * 굿즈샵 하드코딩 데이터 — 사진 1장 = 굿즈 1개 (1:1 매핑).
 *
 * `assets/images/uniform/` 의 파일명이 곧 상품 식별자. 사용자가 의미있게 이름
 * 지어둔 걸 그대로 표시 제목으로 활용 (underscore → space, 색상은 괄호화 등
 * 약간 정규화).
 *
 * `images` 배열이 단일 element 라 ImageLightbox 가 좌/우 화살표 + dot
 * pagination 을 자동 숨긴다 — 카드 탭 시 그 사진 1장만 확대.
 *
 * 슬라이드 순서: 썸네일 인트로 → 의류 상품 → 부가 굿즈 → 안내 정보.
 * 운영자가 이 배열 순서를 바꾸면 굿즈샵 carousel 순서도 그대로 반영.
 */
import type { GoodsItem } from '../types/goods';

export const GOODS_ITEMS_DATA: GoodsItem[] = [
  {
    id: 'goods-uniform-cover',
    title: '대동제 공식유니폼',
    images: [require('../../assets/images/uniform/썸네일_공식유니폼.png')],
  },
  {
    id: 'goods-basketball-white',
    title: '농구복 (하얀색)',
    images: [require('../../assets/images/uniform/농구복_하얀색.png')],
  },
  {
    id: 'goods-baseball-blue',
    title: '야구복 (파란색)',
    images: [require('../../assets/images/uniform/야구복_파란색.png')],
  },
  {
    id: 'goods-baseball-white',
    title: '야구복 (하얀색)',
    images: [require('../../assets/images/uniform/야구복_하얀색.png')],
  },
  {
    id: 'goods-hockey',
    title: '하키복',
    images: [require('../../assets/images/uniform/하키복.png')],
  },
  {
    id: 'goods-hockey-white',
    title: '하키복 (하얀색)',
    images: [require('../../assets/images/uniform/하키복_하얀색.png')],
  },
  {
    id: 'goods-bandana-towel',
    title: '반다나 · 슬로건타올',
    images: [require('../../assets/images/uniform/반다나_슬로건타올.png')],
  },
  {
    id: 'goods-lineup-reform',
    title: '라인업 / 연예인 리폼 안내',
    images: [require('../../assets/images/uniform/라인업연예인_리폼안내.png')],
  },
  {
    id: 'goods-sale-info',
    title: '현장판매 안내',
    images: [require('../../assets/images/uniform/현장판매 안내.png')],
  },
  {
    id: 'goods-sale-location',
    title: '현장판매 위치',
    images: [require('../../assets/images/uniform/현장판매위치.png')],
  },
  {
    id: 'goods-sale-notes',
    title: '현장판매 유의사항',
    images: [require('../../assets/images/uniform/현장판매 유의사항.png')],
  },
];
