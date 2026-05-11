/**
 * 단과대 로고 매핑 — 7개 단과대 모두 학생회 측 통합 로고 적용 완료.
 *
 * - HUMANITIES  → `인문사회융합대학 로고및 메뉴가격/단대 로고.png`
 * - DESIGN      → `디자인앤아트대학 포스터메뉴판로고/도화 한자로고.png`
 * - MUSIC       → `음악테크놀로지대학 메뉴판 및 로고/온음 로고.png`
 * - ICT         → `지능형SW융합대학/지능형단대로고.jpg`
 * - LIFE        → `라이프케어사이언스대학 대동제/학과 로/단대로고.jpg`
 * - ENGINEERING → `혁신공과대학/혁신공과대학로고.jpg`
 * - BUSINESS    → `경영공학대학/경영공학대학 로고.jpg`
 *
 * CollegeGrid 카드 썸네일 / 추후 BoothDetail 헤더 등 단과대 컨텍스트 시각화에 사용.
 */
import type { ImageSourcePropType } from 'react-native';
import type { BackendCollege } from '@api/types';

export const COLLEGE_LOGO: Record<BackendCollege, ImageSourcePropType> = {
  HUMANITIES: require('../../assets/images/college/인문사회융합대학 로고및 메뉴가격/단대 로고.png'),
  DESIGN: require('../../assets/images/college/디자인앤아트대학 포스터메뉴판로고/도화 한자로고.png'),
  MUSIC: require('../../assets/images/college/음악테크놀로지대학 메뉴판 및 로고/온음 로고.png'),
  ICT: require('../../assets/images/college/지능형SW융합대학/지능형단대로고.jpg'),
  LIFE: require('../../assets/images/college/라이프케어사이언스대학 대동제/학과 로/단대로고.jpg'),
  ENGINEERING: require('../../assets/images/college/혁신공과대학/혁신공과대학로고.jpg'),
  BUSINESS: require('../../assets/images/college/경영공학대학/경영공학대학 로고.jpg'),
};

export function collegeLogoFor(collegeKey: BackendCollege | undefined): ImageSourcePropType | undefined {
  if (!collegeKey) return undefined;
  return COLLEGE_LOGO[collegeKey];
}
