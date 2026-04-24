/**
 * useInformation - 추가정보 데이터 접근 훅
 */
import { useMemo, useState, useEffect } from 'react';
import { config } from '@config/env';
import { fetchInformation } from '@api/endpoints';
import { INFORMATION_DATA } from '@data/information';
import type { InformationSection } from '../types/information';

export function useInformation() {
  const [apiData, setApiData] = useState<InformationSection[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    fetchInformation()
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  // API 활성화 시에는 하드코딩 fallback 을 쓰지 않는다 (실패하면 빈 배열 + error).
  const sections = useMemo<InformationSection[]>(
    () => (config.isApiEnabled ? (apiData ?? []) : INFORMATION_DATA),
    [apiData],
  );

  return { data: sections, sections, isLoading, error };
}
