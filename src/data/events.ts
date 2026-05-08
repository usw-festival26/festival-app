/**
 * 축제 이벤트/행사 하드코딩 데이터.
 *
 * 각 이벤트는 `images` 에 다중 사진을 보유.
 * 첫 번째 이미지가 홈 카드 썸네일, 클릭 시 라이트박스에서 좌/우 화살표로 순환.
 *
 * 'uniform' 항목은 같은 사진을 굿즈샵 (`src/data/goodsShop.ts`) 에서도
 * 11개 슬라이드로 1:1 노출 — 양쪽 라이트박스가 같은 자산을 공유.
 */
import type { FestivalEvent } from '../types/map';

export const EVENTS_DATA: FestivalEvent[] = [
  {
    id: 'gayoje',
    title: '수원가요제',
    description: '당신의 목소리로 축제의 무대를 장악하라!',
    images: [
      require('../../assets/images/events/수원가요제/KakaoTalk_20260505_150743979.jpg'),
      require('../../assets/images/events/수원가요제/KakaoTalk_20260505_150743979_01.jpg'),
      require('../../assets/images/events/수원가요제/KakaoTalk_20260505_150743979_02.jpg'),
      require('../../assets/images/events/수원가요제/수원가요제_수정.jpeg'),
    ],
  },
  {
    id: 'signal',
    title: '수원시그널',
    description: '수원시그널 — 사랑의 짝대기',
    images: [
      require('../../assets/images/events/수원시그널/KakaoTalk_20260505_150757242.jpg'),
      require('../../assets/images/events/수원시그널/KakaoTalk_20260505_150757242_01.jpg'),
      require('../../assets/images/events/수원시그널/수원시그널_수정.jpeg'),
      require('../../assets/images/events/수원시그널/KakaoTalk_20260505_150757242_03.jpg'),
    ],
  },
  {
    id: 'uniform',
    title: '대동제 공식유니폼',
    description: '공식 굿즈로 축제의 열기를 더하세요',
    images: [
      require('../../assets/images/uniform/썸네일_공식유니폼.png'),
      require('../../assets/images/uniform/농구복_하얀색.png'),
      require('../../assets/images/uniform/야구복_파란색.png'),
      require('../../assets/images/uniform/야구복_하얀색.png'),
      require('../../assets/images/uniform/하키복.png'),
      require('../../assets/images/uniform/하키복_하얀색.png'),
      require('../../assets/images/uniform/반다나_슬로건타올.png'),
      require('../../assets/images/uniform/라인업연예인_리폼안내.png'),
      require('../../assets/images/uniform/현장판매 안내.png'),
      require('../../assets/images/uniform/현장판매위치.png'),
      require('../../assets/images/uniform/현장판매 유의사항.png'),
    ],
  },
];
