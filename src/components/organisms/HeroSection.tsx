/**
 * HeroSection - 홈 상단 패널 (Figma 2139:753)
 *
 * 새 시안:
 *  - 0~60: 흰색 헤더 (햄버거 좌측 + 미드나잇 가로 로고 가운데)
 *  - 60~596: 메인 포스터 이미지 full-bleed (cover) + 하단 그라디언트로
 *    primary-light(#C3EDFF) 페이드. 다음 섹션과 자연스럽게 이어짐.
 *  - 좌/우 화살표 (14, 554) / (360, 554). dot pagination (183, 565).
 *
 * 포스터는 `src/data/posters.ts` 의 `POSTERS` 배열을 따라간다. 갯수에 따라
 * dot 수와 화살표 표시 여부가 자동 결정 (1장이면 dot/화살표 숨김).
 */
import React, { useState } from 'react';
import { Image, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { POSTERS } from '@data/posters';

const PANEL_HEIGHT = 596;
const HEADER_HEIGHT = 60;
const POSTER_HEIGHT = PANEL_HEIGHT - HEADER_HEIGHT; // 536
// 하단 fade 영역 높이 (Figma: top 309 ~ 596 = 287). 포스터 영역 안 좌표.
const FADE_HEIGHT = 287;

// 헤더 가운데 미드나잇 가로 로고 — intrinsic 1696×729 (≈ 2.326).
const HEADER_LOGO_SOURCE = require('../../../assets/images/logo/미드나잇로고_가로.png');
const HEADER_LOGO_ASPECT_RATIO = 1696 / 729;
const HEADER_LOGO_HEIGHT = 28;
const HEADER_LOGO_WIDTH = Math.round(HEADER_LOGO_HEIGHT * HEADER_LOGO_ASPECT_RATIO);

export function HeroSection() {
  const navigation = useNavigation();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const posterCount = POSTERS.length;
  // POSTERS 가 비어있는 edge case 방어 — 빈 배열이면 화살표/dot 도 안 그리고 이미지도 미표시.
  const safeIndex = posterCount > 0 ? currentIndex % posterCount : 0;
  const currentPoster = POSTERS[safeIndex];
  const showControls = posterCount > 1;

  const goPrev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : posterCount - 1));
  const goNext = () => setCurrentIndex((i) => (i < posterCount - 1 ? i + 1 : 0));

  return (
    <View className="bg-festival-card w-full" style={{ height: PANEL_HEIGHT }}>
      {/* 햄버거 — SafeArea 가 status bar 처리하므로 Figma top:61 - 44 = 17 */}
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ position: 'absolute', left: 16, top: 17, width: 30, height: 30, zIndex: 2 }}
        className="items-center justify-center active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="메뉴 열기"
      >
        <Ionicons name="menu" size={28} color="#000" />
      </Pressable>

      {/* 가운데 미드나잇 가로 로고 (Figma top:62 - 44 = 18) */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, right: 0, top: 18, alignItems: 'center', zIndex: 2 }}
      >
        <Image
          source={HEADER_LOGO_SOURCE}
          style={{ width: HEADER_LOGO_WIDTH, height: HEADER_LOGO_HEIGHT }}
          resizeMode="contain"
          accessibilityLabel="미드나잇 로고"
        />
      </View>

      {/* 메인 포스터 — 헤더 아래 full-bleed cover. 포스터 영역 탭 시 지도(/booth)
          로 이동. 화살표/dot 은 zIndex 2 로 위에 있어 자체 onPress 가 우선. */}
      <Pressable
        onPress={() => router.navigate('/(tabs)/booth' as never)}
        accessibilityRole="link"
        accessibilityLabel="지도로 이동"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: HEADER_HEIGHT,
          height: POSTER_HEIGHT,
          overflow: 'hidden',
        }}
      >
        {currentPoster ? (
          <Image
            source={currentPoster}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            accessibilityLabel="2026 대동제 포스터"
          />
        ) : null}
        {/* 하단 페이드 — 포스터를 #C3EDFF (primary-light) 로 자연스럽게 잇기.
            pointerEvents=none 으로 부모 Pressable 의 onPress 를 막지 않음. */}
        <Svg
          pointerEvents="none"
          width="100%"
          height={FADE_HEIGHT}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
        >
          <Defs>
            <LinearGradient id="hero-fade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#C3EDFF" stopOpacity="0" />
              <Stop offset="1" stopColor="#C3EDFF" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill="url(#hero-fade)" />
        </Svg>
      </Pressable>

      {/* 1장 이하면 화살표/dot 의미 없으니 숨김 */}
      {showControls ? (
        <>
          {/* 좌측 화살표 (Figma top:598 - 44 = 554) */}
          <Pressable
            onPress={goPrev}
            style={{ position: 'absolute', left: 14, top: 554, width: 28, height: 28, zIndex: 2 }}
            className="items-center justify-center active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="이전 포스터"
          >
            <Ionicons name="chevron-back" size={28} color="#010070" />
          </Pressable>

          {/* 우측 화살표 */}
          <Pressable
            onPress={goNext}
            style={{ position: 'absolute', left: 360, top: 554, width: 28, height: 28, zIndex: 2 }}
            className="items-center justify-center active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="다음 포스터"
          >
            <Ionicons name="chevron-forward" size={28} color="#010070" />
          </Pressable>

          {/* Dot pagination — 갯수는 POSTERS 배열 길이 따라감.
              가운데 정렬 + dot 사이 6px gap 으로 4장 기준 폭 36px 유지. */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 565,
              height: 6,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              zIndex: 2,
            }}
          >
            {POSTERS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === safeIndex ? '#010070' : '#D9D9D9',
                }}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}
