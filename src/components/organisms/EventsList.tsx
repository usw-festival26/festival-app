/**
 * EventsList - 이벤트 페이지 세로 카드 리스트 (Figma 1590:1116)
 *
 * useEvents() 로 데이터 가져와 EventListCard 를 세로로 나열.
 * 카드 간격 40px, 카드 아래 텍스트 포함 높이 ≈ 340px.
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { useEvents } from '@hooks/index';
import { EventListCard } from '@molecules/EventListCard';

export function EventsList() {
  const { data } = useEvents();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 24, paddingBottom: 48, alignItems: 'center', gap: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {data.map((item) => (
        <EventListCard
          key={item.id}
          title={item.title}
          description={item.description}
          imageUri={item.imageUri}
        />
      ))}
    </ScrollView>
  );
}
