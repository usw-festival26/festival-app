/**
 * EventsSection - 홈 화면 Events 가로 스크롤 섹션
 *
 * Figma 74:28: "Events" 타이틀 + 가로 스크롤 카드 목록
 */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppText } from '../atoms/AppText';

interface EventItem {
  id: string;
  line1: string;
  line2: string;
}

const EVENTS: EventItem[] = [
  { id: '1', line1: '내용 뭐쓰지', line2: '흠냐냐~' },
  { id: '2', line1: '내용 뭐쓰지', line2: '흠냐냐~' },
  { id: '3', line1: '내용 뭐쓰지', line2: '흠냐냐~' },
];

export function EventsSection() {
  return (
    <View className="mb-4">
      <AppText className="text-[12px] font-bold leading-[45px] px-8 text-black">
        Events
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 17, gap: 10 }}
      >
        {EVENTS.map((item) => (
          <View
            key={item.id}
            className="w-[140px] h-[180px] bg-festival-primary rounded-[12px] justify-end p-[14px]"
          >
            <AppText className="text-[11px] text-black tracking-[-0.5px] leading-[20px]">
              {item.line1}
            </AppText>
            <AppText className="text-[11px] text-black tracking-[-0.5px] leading-[20px]">
              {item.line2}
            </AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
