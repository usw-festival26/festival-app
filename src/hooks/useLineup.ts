/**
 * useLineup - 라인업 데이터 접근 훅
 */
import { useMemo } from 'react';
import { LINEUP_DATA } from '../data/lineup';
import type { Artist } from '../types/lineup';

export function useLineup() {
  const data = useMemo<Artist[]>(() => LINEUP_DATA, []);
  return { data, isLoading: false, error: null as string | null };
}
