/**
 * 타임테이블 화면 - 공연 일정 조회
 */
import React from 'react';
import { ListScreenTemplate } from '../../src/components/templates/ListScreenTemplate';
import { TimetableGrid } from '../../src/components/organisms/TimetableGrid';
import { useTimetable } from '../../src/hooks/useTimetable';

export default function TimetableScreen() {
  const { days, stages } = useTimetable();

  return (
    <ListScreenTemplate title="타임테이블">
      <TimetableGrid days={days} stages={stages} />
    </ListScreenTemplate>
  );
}
