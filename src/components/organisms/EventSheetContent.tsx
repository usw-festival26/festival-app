/**
 * EventSheetContent - 지도 바텀시트: 이벤트/행사 카드 리스트
 *
 * Figma 166:472
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '@atoms/AppText';
import { EventCard } from '@molecules/EventCard';
import type { FestivalEvent } from '../../types/map';

export interface EventSheetContentProps {
  events: FestivalEvent[];
}

export function EventSheetContent({ events }: EventSheetContentProps) {
  return (
    <View>
      <AppText className="text-xl font-black text-center mb-4">이벤트</AppText>
      {events.map((item) => (
        <EventCard key={item.id} title={item.title} description={item.description} />
      ))}
    </View>
  );
}
