/**
 * 축제 이벤트/행사 하드코딩 데이터.
 *
 * 각 이벤트는 `images` 에 다중 사진(`assets/images/events/<폴더>/`) 을 보유.
 * 첫 번째 이미지가 홈 카드 썸네일, 클릭 시 라이트박스에서 좌/우 화살표로 순환.
 */
import type { FestivalEvent } from '../types/map';

export const EVENTS_DATA: FestivalEvent[] = [
  {
    id: 'gayoje',
    title: '수원가요제',
    description: '학내 동아리 무대 — 자세한 내용은 추후 공지',
    images: [
      require('../../assets/images/events/수원가요제/KakaoTalk_20260505_150743979.jpg'),
      require('../../assets/images/events/수원가요제/KakaoTalk_20260505_150743979_01.jpg'),
      require('../../assets/images/events/수원가요제/KakaoTalk_20260505_150743979_02.jpg'),
      require('../../assets/images/events/수원가요제/KakaoTalk_20260505_150743979_03.jpg'),
    ],
  },
  {
    id: 'signal',
    title: '수원시그널',
    description: '수원시그널 — 자세한 내용은 추후 공지',
    images: [
      require('../../assets/images/events/수원시그널/KakaoTalk_20260505_150757242.jpg'),
      require('../../assets/images/events/수원시그널/KakaoTalk_20260505_150757242_01.jpg'),
      require('../../assets/images/events/수원시그널/KakaoTalk_20260505_150757242_02.jpg'),
      require('../../assets/images/events/수원시그널/KakaoTalk_20260505_150757242_03.jpg'),
    ],
  },
  {
    id: 'uniform',
    title: '유니폼',
    description: '유니폼 — 자세한 내용은 추후 공지',
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
