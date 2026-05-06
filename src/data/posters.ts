/**
 * 홈 상단 캐러셀(HeroSection) 에 표시할 포스터 이미지 목록.
 *
 * 포스터 추가 방법:
 *  1) PNG/JPG 파일을 `assets/images/posters/` (또는 원하는 경로) 에 저장.
 *  2) 아래 배열 끝에 `require('경로')` 한 줄 추가.
 *  3) 캐러셀의 dot 갯수와 좌/우 화살표 표시 여부는 배열 길이를 보고 자동 결정
 *     (1장이면 화살표·dot 숨김).
 *
 * 순서대로 표시되며 마지막에서 다음을 누르면 첫 장으로 순환.
 */
import type { ImageSourcePropType } from 'react-native';

export const POSTERS: ImageSourcePropType[] = [
  require('../../assets/images/축제포스터_사이즈.png'),
];
