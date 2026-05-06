/**
 * 축제 아티스트 라인업 픽스처.
 *
 * day1/day2 구분 없이 단일 리스트로 관리. 사진은 `assets/images/artist/`.
 * 정식 아티스트 정보(이름/소개) 는 운영자가 이 파일에서 직접 수정.
 *
 * day 필드 — 타임테이블의 공연 일차 기반 매핑.
 *  - DAY 1 (2026-05-14): TNX, Crush, Heize, YB
 *  - DAY 2 (2026-05-15): Keyveatz, NOWIMYOUNG, HAON, PSY, DJ SUVIN
 *  - 양일/미정인 경우 day 를 비워둠.
 *
 * NOTE (2026-05-05): 사용자 의도와 반대로 8장이 잘못 삭제되어 임시 비움 상태.
 * 사진 재업로드 후 entry 추가 예정.
 */
import type { Artist } from '../types/lineup';

export const LINEUP_DATA: Artist[] = [
  {
    id: '3',
    name: 'TNX',
    info: '@official.tnx',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_02.jpg'),
    day: 1,
  },
  {
    id: '4',
    name: 'Crush',
    info: '@crush9244',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_03.jpg'),
    day: 1,
  },
  {
    id: '5',
    name: 'Heize',
    info: '@heizeheize',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_04.jpg'),
    day: 1,
  },
  {
    id: '6',
    name: 'YB',
    info: '@yb_official_insta',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_05.jpg'),
    day: 1,
  },
  {
    id: '8',
    name: 'Keyveatz',
    info: '@keyveatz',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_07.jpg'),
    day: 2,
  },
  {
    id: '9',
    name: 'NOWIMYOUNG',
    info: '@now_im_young',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_08.jpg'),
    day: 2,
  },
  {
    id: '10',
    name: 'HAON',
    info: '@noahmik',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_09.jpg'),
    day: 2,
  },
  {
    id: '11',
    name: 'PSY',
    info: '@42psy42',
    image: require('../../assets/images/artist/Psy.jpg'),
    day: 2,
  },
  {
    id: '12',
    name: 'DJ SUVIN',
    info: '@dalsooobin',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_11.jpg'),
    day: 2,
  },
];
