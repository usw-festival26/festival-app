/**
 * useInformation - 추가정보 데이터 접근 훅
 *
 * 백엔드 스펙이 미정이라 src/data/information.ts 의 하드코딩 데이터만 사용한다.
 * 운영팀이 직접 편집해 배포한다.
 *
 * 반환:
 * - aboutBody: About 카드 본문 (인스타/사이트 줄 제외)
 * - instagramUrl, siteUrl: About 본문 끝 인라인 링크 타깃
 * - developers: Who We Are? 섹션 멤버 리스트
 * - sections, data: (deprecated) 운영 안내 섹션 — 현재 화면에선 미사용
 */
import {
  ABOUT_BODY,
  DEVELOPERS,
  INFORMATION_DATA,
  LIKELION_INSTAGRAM_URL,
  LIKELION_SITE_URL,
} from '@data/information';
import type { Developer, InformationSection } from '../types/information';

export interface UseInformationResult {
  aboutBody: string;
  instagramUrl: string;
  siteUrl: string;
  developers: Developer[];
  /** @deprecated 현재 InformationContent 에서 미사용 — 운영 안내 카드 추가 시 재활용 예정 */
  sections: InformationSection[];
  /** @deprecated `sections` 와 동일 */
  data: InformationSection[];
  isLoading: boolean;
  error: string | null;
}

export function useInformation(): UseInformationResult {
  return {
    aboutBody: ABOUT_BODY,
    instagramUrl: LIKELION_INSTAGRAM_URL,
    siteUrl: LIKELION_SITE_URL,
    developers: DEVELOPERS,
    sections: INFORMATION_DATA,
    data: INFORMATION_DATA,
    isLoading: false,
    error: null,
  };
}
