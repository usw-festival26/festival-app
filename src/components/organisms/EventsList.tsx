/**
 * EventsList - 이벤트 페이지 세로 카드 리스트 (Figma 1590:1116)
 *
 * useEvents() 로 데이터 가져와 EventListCard 를 세로로 나열.
 * 카드 간격 40px, 카드 아래 텍스트 포함 높이 ≈ 340px.
 */
import { AppText } from '@components/atoms/AppText';
import { useEvents } from '@hooks/index';
import { EventListCard } from '@molecules/EventListCard';
import React from 'react';
import { Platform, ScrollView } from 'react-native';

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

export function EventsList() {
  const { data } = useEvents();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: 24, paddingBottom: 48, alignItems: 'center', gap: 40 }}
      showsVerticalScrollIndicator={false}
    >

      <AppText
        style={{
          fontFamily: ROBOTO_BLACK,
          fontWeight: '900',
          fontSize: 32,
          lineHeight: 45,
          color: '#010070',
          textAlign: 'center',
        }}
      >
        Events
      </AppText>

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
