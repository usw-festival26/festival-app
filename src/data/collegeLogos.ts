/**
 * 단과대 로고 매핑 — `assets/images/수원대 로고/수원대 로고/<단과대명>.png`.
 *
 * CollegeGrid 카드 썸네일 / 추후 BoothDetail 헤더 등 단과대 컨텍스트 시각화에 사용.
 * 7개 단과대 enum 모두 매핑.
 */
import type { ImageSourcePropType } from 'react-native';
import type { BackendCollege } from '../api/types';

export const COLLEGE_LOGO: Record<BackendCollege, ImageSourcePropType> = {
  HUMANITIES: require('../../assets/images/수원대 로고/수원대 로고/인문사회융합대학.png'),
  BUSINESS: require('../../assets/images/수원대 로고/수원대 로고/경영공학대학.png'),
  LIFE: require('../../assets/images/수원대 로고/수원대 로고/라이프케어사이언스대학.png'),
  ICT: require('../../assets/images/수원대 로고/수원대 로고/지능형SW융합대학.png'),
  DESIGN: require('../../assets/images/수원대 로고/수원대 로고/디자인앤아트대학.png'),
  MUSIC: require('../../assets/images/수원대 로고/수원대 로고/음악테크놀로지대학.png'),
  ENGINEERING: require('../../assets/images/수원대 로고/수원대 로고/혁신공과대학.png'),
};

export function collegeLogoFor(collegeKey: BackendCollege | undefined): ImageSourcePropType | undefined {
  if (!collegeKey) return undefined;
  return COLLEGE_LOGO[collegeKey];
}
