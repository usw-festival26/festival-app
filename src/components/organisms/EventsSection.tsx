/**
 * EventsSection - 홈 Events 가로 스크롤 (Figma 920:3828)
 *
 * "Events" 라벨 Roboto Black 20 white, left:61 (좌측 정렬).
 * 카드 140×180 rounded-12, 텍스트 (left:14, top:133) Pretendard Medium 11.
 * "더보기" → /events 전용 페이지로 이동.
 */
import React from 'react';
import { View, ScrollView, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useHorizontalDrag, useEvents } from '@hooks/index';

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });
const PRETENDARD_MEDIUM = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Medium' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

export function EventsSection() {
  const router = useRouter();
  const dragRef = useHorizontalDrag();
  const { data } = useEvents();

  return (
    <View style={{ paddingTop: 41, paddingBottom: 27 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20,
          paddingRight: 17,
          marginBottom: 14,
        }}
      >
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
        <Pressable
          onPress={() => router.push('/(tabs)/events' as any)}
          hitSlop={8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          accessibilityRole="link"
          accessibilityLabel="이벤트 더보기"
        >
          <Text
            style={{
              fontFamily: PRETENDARD_REGULAR,
              fontWeight: '400',
              fontSize: 12,
              color: '#FFFFFF',
              opacity: 0.9,
            }}
          >
            더보기
          </Text>
          <Ionicons name="chevron-forward" size={12} color="#FFFFFF" style={{ opacity: 0.9 }} />
        </Pressable>
      </View>

      <ScrollView
        ref={dragRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 17, paddingRight: 48, gap: 10 }}
      >
        {data.slice(0, 6).map((item) => (
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
            <View style={{ position: 'absolute', left: 14, top: 133, right: 14 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: PRETENDARD_MEDIUM,
                  fontWeight: '500',
                  fontSize: 11,
                  lineHeight: 20,
                  letterSpacing: -0.5,
                  color: '#000',
                }}
              >
                {item.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: PRETENDARD_MEDIUM,
                  fontWeight: '500',
                  fontSize: 11,
                  lineHeight: 20,
                  letterSpacing: -0.5,
                  color: '#666',
                }}
              >
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
