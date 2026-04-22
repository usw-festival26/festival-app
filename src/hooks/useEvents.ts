/**
 * useEvents - 이벤트 데이터 접근 훅
 */
import { useMemo } from 'react';
import { EVENTS_DATA } from '../data/events';
import type { FestivalEvent } from '../types/map';

export function useEvents() {
  const data = useMemo<FestivalEvent[]>(() => EVENTS_DATA, []);
  return { data, isLoading: false, error: null as string | null };
}
