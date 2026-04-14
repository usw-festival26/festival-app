/**
 * EventsSection - 홈 Events 가로 스크롤 (Figma 920:3828)
 *
 * "Events" 라벨 Roboto Black 20 white, left:61 (좌측 정렬).
 * 카드 140×180 rounded-12, 텍스트 (left:14, top:133) Pretendard Medium 11.
 */
import React from 'react';
import { View, ScrollView, Text, Platform } from 'react-native';
import { GradientBlob } from '../atoms/GradientBlob';

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

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

export function EventsSection() {
  return (
    <View
      className="bg-festival-primary-dark"
      style={{ paddingTop: 41, paddingBottom: 16, overflow: 'hidden', position: 'relative' }}
    >
      {/* 좌측 blob 92 (Figma Ellipse69 @ -3, 594 within home, 여기서는 섹션 좌측 edge) */}
      <View pointerEvents="none" style={{ position: 'absolute', left: -46, top: -20 }}>
        <GradientBlob size={92} gradientId="evt-blob" reversed />
      </View>

      {/* "Events" 좌측 정렬 */}
      <View style={{ paddingLeft: 61, marginBottom: 14 }}>
        <Text
          style={{
            fontFamily: ROBOTO_BLACK,
            fontWeight: '900',
            fontSize: 20,
            lineHeight: 23,
            color: '#FFFFFF',
            letterSpacing: 0,
          }}
        >
          Events
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 17, gap: 10 }}
      >
        {EVENTS.map((item) => (
          <View
            key={item.id}
            style={{
              width: 140,
              height: 180,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              position: 'relative',
            }}
          >
            <View style={{ position: 'absolute', left: 14, top: 133 }}>
              <Text
                style={{
                  fontFamily: 'Pretendard-Medium',
                  fontSize: 11,
                  lineHeight: 20,
                  letterSpacing: -0.5,
                  color: '#000',
                }}
              >
                {item.line1}
              </Text>
              <Text
                style={{
                  fontFamily: 'Pretendard-Medium',
                  fontSize: 11,
                  lineHeight: 20,
                  letterSpacing: -0.5,
                  color: '#000',
                }}
              >
                {item.line2}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
