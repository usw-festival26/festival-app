/**
 * LineupSection - 홈 Line up 가로 스크롤 (Figma 2139:753)
 *
 * "Line up" 라벨 좌측 + 우측 "더보기" 링크, 카드 140×180.
 * 카드는 아티스트 사진을 배경으로 cover, 하단 어두운 그라디언트 오버레이 위에
 * 흰 글씨로 아티스트 이름. 카드 탭 시 /lineup 으로 이동.
 *
 * `useLineup` 의 Artist 데이터에 image (require'd asset) / imageUrl (외부) 중
 * 하나가 있으면 cover 로 배경 적용. 둘 다 없으면 기본 흰색 카드.
 */
import React from 'react';
import { Image, View, ScrollView, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useLineup, useHorizontalDrag } from '@hooks/index';
import { safeImageSource } from '@utils/imageSource';

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

const CARD_W = 140;
const CARD_H = 180;
const NAME_BOTTOM_FADE_HEIGHT = 64; // 이름 영역 위로 내려오는 어두운 그라디언트 높이

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
            color: '#010070',
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
              color: '#010070',
              opacity: 0.9,
            }}
          >
            더보기
          </Text>
          <Ionicons name="chevron-forward" size={12} color="#010070" style={{ opacity: 0.9 }} />
        </Pressable>
      </View>

      <ScrollView
        ref={dragRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 17, paddingRight: 48, gap: 10 }}
      >
        {data.slice(0, 6).map((item) => {
          const remoteSrc = safeImageSource(item.imageUrl);
          const imageSource = item.image ?? remoteSrc ?? null;
          return (
            <Pressable
              key={item.id}
              onPress={() => router.push('/(tabs)/lineup' as any)}
              accessibilityRole="link"
              accessibilityLabel={`${item.name} — 라인업 자세히 보기`}
              style={({ pressed }) => ({
                width: CARD_W,
                height: CARD_H,
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                overflow: 'hidden',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : null}

              {/* 하단 어두운 그라디언트 — 흰 이름 텍스트 가독성 확보 */}
              {imageSource ? (
                <Svg
                  width="100%"
                  height={NAME_BOTTOM_FADE_HEIGHT}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
                >
                  <Defs>
                    <LinearGradient id={`lineup-fade-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                      <Stop offset="1" stopColor="#000000" stopOpacity="0.55" />
                    </LinearGradient>
                  </Defs>
                  <Rect x="0" y="0" width="100" height="100" fill={`url(#lineup-fade-${item.id})`} />
                </Svg>
              ) : null}

              <View style={{ position: 'absolute', left: 14, top: 147 }}>
                <Text
                  style={{
                    fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' }),
                    fontWeight: '600',
                    fontSize: 13,
                    lineHeight: 18,
                    letterSpacing: -0.5,
                    color: imageSource ? '#FFFFFF' : '#010070',
                  }}
                >
                  {item.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
