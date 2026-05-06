/**
 * HeroSection - 홈 상단 패널 (Figma 2139:753)
 *
 * 새 시안:
 *  - 0~60: 흰색 헤더 (햄버거 좌측 + 미드나잇 가로 로고 가운데)
 *  - 60~596: 메인 포스터 이미지 full-bleed (cover) + 하단 그라디언트로
 *    primary-light(#C3EDFF) 페이드. 다음 섹션과 자연스럽게 이어짐.
 *  - 좌/우 화살표 (14, 554) / (360, 554). 4개 dot pagination (183, 565).
 *
 * 포스터 carousel — 일단 단일 이미지(`assets/images/축제포스터_사이즈.png`).
 * 추후 여러 장 받으면 currentIndex 에 매핑된 이미지 배열로 확장.
 */
import React, { useState } from 'react';
import { Image, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const POSTER_COUNT = 4;
const PANEL_HEIGHT = 596;
const HEADER_HEIGHT = 60;
const POSTER_HEIGHT = PANEL_HEIGHT - HEADER_HEIGHT; // 536
// 하단 fade 영역 높이 (Figma: top 309 ~ 596 = 287). 포스터 영역 안 좌표.
const FADE_HEIGHT = 287;

const POSTER_IMAGE = require('../../../assets/images/축제포스터_사이즈.png');

// 헤더 가운데 미드나잇 가로 로고 — intrinsic 1696×729 (≈ 2.326).
const HEADER_LOGO_SOURCE = require('../../../assets/images/logo/미드나잇로고_가로.png');
const HEADER_LOGO_ASPECT_RATIO = 1696 / 729;
const HEADER_LOGO_HEIGHT = 28;
const HEADER_LOGO_WIDTH = Math.round(HEADER_LOGO_HEIGHT * HEADER_LOGO_ASPECT_RATIO);

export function HeroSection() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : POSTER_COUNT - 1));
  const goNext = () => setCurrentIndex((i) => (i < POSTER_COUNT - 1 ? i + 1 : 0));

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

      {/* 메인 포스터 — 헤더 아래 full-bleed cover */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: HEADER_HEIGHT,
          height: POSTER_HEIGHT,
          overflow: 'hidden',
        }}
      >
        <Image
          source={POSTER_IMAGE}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          accessibilityLabel="2026 대동제 포스터"
        />
        {/* 하단 페이드 — 포스터를 #C3EDFF (primary-light) 로 자연스럽게 잇기 */}
        <Svg
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
      </View>

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

      {/* Dot pagination (Figma top:609 - 44 = 565) */}
      <View
        style={{
          position: 'absolute',
          left: 183,
          top: 565,
          width: 36,
          height: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        {Array.from({ length: POSTER_COUNT }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === currentIndex ? '#010070' : '#D9D9D9',
            }}
          />
        ))}
      </View>
    </View>
  );
}
