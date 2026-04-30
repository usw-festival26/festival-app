/**
 * useInformation - 추가정보 데이터 접근 훅
 *
 * 추가정보는 백엔드 스펙이 미정이라 API 연동 없이 src/data/information.ts 의
 * 하드코딩 데이터만 사용한다. 운영팀이 직접 편집해 배포한다.
 */
import { INFORMATION_DATA } from '@data/information';
import type { InformationSection } from '../types/information';

export interface UseInformationResult {
  data: InformationSection[];
  sections: InformationSection[];
  isLoading: boolean;
  error: string | null;
}

export function useInformation(): UseInformationResult {
  return {
    data: INFORMATION_DATA,
    sections: INFORMATION_DATA,
    isLoading: false,
    error: null,
  };
}
