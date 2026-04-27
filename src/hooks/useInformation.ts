/**
 * useInformation - 추가정보 데이터 접근 훅
 */
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { config } from '@config/env';
import { fetchInformation } from '@api/endpoints';
import { INFORMATION_DATA } from '@data/information';
import type { InformationSection } from '../types/information';

export function useInformation() {
  const [apiData, setApiData] = useState<InformationSection[] | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);
  // unmount/재요청 시 in-flight 응답이 unmounted state 를 건드리지 않도록 request 식별자로 가드.
  const requestIdRef = useRef(0);

  const retry = useCallback(() => {
    if (!config.isApiEnabled) return;
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    fetchInformation()
      .then((d) => { if (requestId === requestIdRef.current) setApiData(d); })
      .catch((e: Error) => { if (requestId === requestIdRef.current) setError(e.message); })
      .finally(() => { if (requestId === requestIdRef.current) setIsLoading(false); });
  }, []);

  useEffect(() => {
    retry();
    return () => { requestIdRef.current++; };
  }, [retry]);

  // API 활성화 시에는 하드코딩 fallback 을 쓰지 않는다 (실패하면 빈 배열 + error).
  const sections = useMemo<InformationSection[]>(
    () => (config.isApiEnabled ? (apiData ?? []) : INFORMATION_DATA),
    [apiData],
  );

  return { data: sections, sections, isLoading, error, retry };
}
