/**
 * 이벤트 화면 - Figma 1590:1116
 *
 * 홈 EventsSection 의 "더보기" 로부터 진입하는 전용 리스트 페이지.
 * BackdropScreenTemplate(네이비 배경 + 흰 헤더) + EventsList.
 */
import React from 'react';
import { BackdropScreenTemplate } from '../../src/components/templates/BackdropScreenTemplate';
import { EventsList } from '../../src/components/organisms/EventsList';

export default function EventsScreen() {
  return (
    <BackdropScreenTemplate
      title="이벤트"
      backdropVariant="home"
      headerTextColor="#000000"
    >
      <EventsList />
    </BackdropScreenTemplate>
  );
}
