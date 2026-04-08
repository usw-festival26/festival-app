/**
 * 타임테이블 데이터 접근 훅
 *
 * 현재는 하드코딩 데이터를 반환합니다.
 * 백엔드 연동 시 이 훅 내부만 수정하면 됩니다.
 */
import { useMemo, useState, useEffect } from 'react';
import { config } from '@config/env';
import { fetchTimetable } from '@api/endpoints';
import { TIMETABLE_DATA } from '../data/timetable';
import type { Performance, PerformanceCategory, Stage, TimetableDay, TimetableData } from '../types/timetable';

export interface UseTimetableOptions {
  /** 특정 날짜로 필터 (ISO date) */
  date?: string;
  /** 특정 무대로 필터 */
  stageId?: string;
  /** 특정 카테고리로 필터 */
  category?: PerformanceCategory;
  /** 검색어 필터 */
  searchQuery?: string;
}

export interface UseTimetableResult {
  stages: Stage[];
  days: TimetableDay[];
  performances: Performance[];
  isLoading: boolean;
  error: string | null;
}

export function useTimetable(options?: UseTimetableOptions): UseTimetableResult {
  const { date, stageId, category, searchQuery } = options ?? {};
  const [apiData, setApiData] = useState<TimetableData | null>(null);
  const [isLoading, setIsLoading] = useState(config.isApiEnabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config.isApiEnabled) return;
    setIsLoading(true);
    fetchTimetable()
      .then(setApiData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const source = apiData ?? TIMETABLE_DATA;

  const filteredDays = useMemo(() => {
    let days = source.days;

    if (date) {
      days = days.filter((d) => d.date === date);
    }

    return days.map((day) => ({
      ...day,
      performances: day.performances.filter((p) => {
        if (stageId && p.stageId !== stageId) return false;
        if (category && p.category !== category) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            p.artistName.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    }));
  }, [source, date, stageId, category, searchQuery]);

  const allPerformances = useMemo(
    () => filteredDays.flatMap((d) => d.performances),
    [filteredDays],
  );

  return {
    stages: source.stages,
    days: filteredDays,
    performances: allPerformances,
    isLoading,
    error,
  };
}
