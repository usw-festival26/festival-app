/**
 * 굿즈샵 하드코딩 데이터.
 *
 * Figma node 2047:725 — 첫 슬라이드 "농구복" + 페이지네이션 "1/N" 으로 노출.
 * 이미지가 도착하기 전 항목은 imageUri/image 미설정 → GoodsCarouselCard 가 빈
 * 박스(흰 배경 + 검정 보더) 노출.
 *
 * `images` 배열을 채우면 카드 탭 시 ImageLightbox 모달 carousel 활성.
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
  {
    id: 'goods-uniform',
    title: '대동제 공식유니폼',
    description: '공식 굿즈로 축제의 열기를 더하세요',
    images: [
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_01.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_02.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_03.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_04.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_05.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_06.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_07.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_08.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_09.png'),
      require('../../assets/images/uniform/KakaoTalk_20260505_150809976_10.png'),
    ],
  },
];
