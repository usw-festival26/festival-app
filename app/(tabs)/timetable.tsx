/**
 * 타임테이블 화면 - Figma 82:82
 *
 * 무대 시각화 + DAY 선택 + 공연 리스트
 */
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/molecules/ScreenHeader';
import { TimetableGrid } from '../../src/components/organisms/TimetableGrid';
import { useTimetable } from '../../src/hooks/useTimetable';

export default function TimetableScreen() {
  const { days, stages } = useTimetable();

  return (
    <SafeAreaView className="flex-1 bg-festival-bg" edges={['top']}>
      <ScreenHeader title="타임테이블" />
      <TimetableGrid days={days} stages={stages} />
    </SafeAreaView>
  );
}
