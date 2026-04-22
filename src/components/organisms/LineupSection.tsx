/**
 * LineupSection - 홈 Line up 가로 스크롤 (Figma 1334:802)
 *
 * "Line up" 라벨 좌측(paddingLeft:61) + 우측 "더보기" 링크, 카드 140×180.
 * 카드 내부 "아티스트 이름" placeholder는 top:147 (Events의 top:133과 다름).
 */
import React from 'react';
import { View, ScrollView, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLineup, useHorizontalDrag } from '@hooks/index';

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

export function LineupSection() {
  const router = useRouter();
  const { data } = useLineup();
  const dragRef = useHorizontalDrag();

  return (
    <View style={{ paddingTop: 41, paddingBottom: 0 }}>
      {/* 라벨 행: 좌측 "Line up" + 우측 "더보기" */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20,
          paddingRight: 17,
          marginBottom: 19,
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
          Line up
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/lineup' as any)}
          hitSlop={8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          accessibilityRole="link"
          accessibilityLabel="라인업 더보기"
        >
          <Text
            style={{
              fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' }),
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
            <View style={{ position: 'absolute', left: 17, top: 147 }}>
              <Text
                style={{
                  fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Medium' }),
                  fontWeight: '500',
                  fontSize: 11,
                  lineHeight: 20,
                  letterSpacing: -0.5,
                  color: '#000',
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
