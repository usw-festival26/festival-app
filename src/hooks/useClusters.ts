/**
 * 단과대 그룹 클러스터 데이터 접근 훅.
 *
 * 백엔드 단과대 그룹 응답 스펙이 미정이라 지금은 하드코딩(CLUSTERS_DATA) 만
 * 반환한다. 추후 swagger 에 endpoint 추가되면 useBooths 패턴(config.isApiEnabled
 * 분기 + retry) 으로 확장.
 */
import { CLUSTERS_DATA } from '@data/clusters';
import type { BoothCluster } from '../types/cluster';

export interface UseClustersResult {
  data: BoothCluster[];
  clusters: BoothCluster[];
  isLoading: boolean;
  error: string | null;
}

export function useClusters(): UseClustersResult {
  return {
    data: CLUSTERS_DATA,
    clusters: CLUSTERS_DATA,
    isLoading: false,
    error: null,
  };
}
