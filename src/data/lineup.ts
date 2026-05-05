/**
 * 축제 아티스트 라인업 픽스처.
 *
 * day1/day2 구분 없이 단일 리스트로 관리. 사진은 `assets/images/artist/` 의 8장.
 * id 는 사용자가 원래 지정한 번호(3~12 에서 1·2·7·11 제외) 를 그대로 보존 — 추후
 * 추가/제거 시 충돌 방지 + 사용자 멘션 번호와 1:1 매칭.
 * 정식 아티스트 정보(이름/소개) 는 운영자가 이 파일에서 직접 수정.
 */
import type { Artist } from '../types/lineup';

export const LINEUP_DATA: Artist[] = [
  {
    id: '3',
    name: 'Artist 3',
    info: 'Information',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_02.jpg'),
  },
  {
    id: '4',
    name: 'Artist 4',
    info: 'Information',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_03.jpg'),
  },
  {
    id: '5',
    name: 'Artist 5',
    info: 'Information',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_04.jpg'),
  },
  {
    id: '6',
    name: 'Artist 6',
    info: 'Information',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_05.jpg'),
  },
  {
    id: '8',
    name: 'Artist 8',
    info: 'Information',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_07.jpg'),
  },
  {
    id: '9',
    name: 'Artist 9',
    info: 'Information',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_08.jpg'),
  },
  {
    id: '10',
    name: 'Artist 10',
    info: 'Information',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_09.jpg'),
  },
  {
    id: '12',
    name: 'Artist 12',
    info: 'Information',
    image: require('../../assets/images/artist/KakaoTalk_20260504_180424389_11.jpg'),
  },
];
