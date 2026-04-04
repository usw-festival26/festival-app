/**
 * useInformation - 추가정보 데이터 접근 훅
 */
import { useMemo } from 'react';
import { INFORMATION_DATA } from '../data/information';
import type { InformationSection } from '../types/information';

export function useInformation() {
  const sections = useMemo<InformationSection[]>(() => INFORMATION_DATA, []);

  return { sections, isLoading: false };
}
