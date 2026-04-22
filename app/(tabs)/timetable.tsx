/**
 * 타임테이블 화면 - Figma 82:82
 *
 * 무대 시각화 + DAY 선택 + 공연 리스트. 공용 BackdropScreenTemplate 로 헤더/배경 통일.
 */
import React from 'react';
import { BackdropScreenTemplate } from '../../src/components/templates/BackdropScreenTemplate';
import { TimetableGrid } from '../../src/components/organisms/TimetableGrid';
import { useTimetable } from '../../src/hooks/useTimetable';

export default function TimetableScreen() {
  const { days, stages } = useTimetable();

  return (
    <BackdropScreenTemplate title="타임테이블" backdropVariant="timetable">
      <TimetableGrid days={days} stages={stages} />
    </BackdropScreenTemplate>
  );
}
