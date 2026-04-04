/**
 * 타임테이블 데이터 접근 훅
 *
 * 현재는 하드코딩 데이터를 반환합니다.
 * 백엔드 연동 시 이 훅 내부만 수정하면 됩니다.
 */
import { useMemo } from 'react';
import { TIMETABLE_DATA } from '../data/timetable';
import type { Performance, PerformanceCategory, Stage, TimetableDay } from '../types/timetable';

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
}

export function useTimetable(options?: UseTimetableOptions): UseTimetableResult {
  const { date, stageId, category, searchQuery } = options ?? {};

  const filteredDays = useMemo(() => {
    let days = TIMETABLE_DATA.days;

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
  }, [date, stageId, category, searchQuery]);

  const allPerformances = useMemo(
    () => filteredDays.flatMap((d) => d.performances),
    [filteredDays],
  );

  return {
    stages: TIMETABLE_DATA.stages,
    days: filteredDays,
    performances: allPerformances,
    isLoading: false,
  };
}
