/**
 * HeroSection - 홈 상단 패널 (Figma 2139:753)
 *
 * 새 시안:
 *  - 0~60: 흰색 헤더 (햄버거 좌측 + 미드나잇 가로 로고 가운데)
 *  - 60~패널끝: 메인 포스터 이미지 full-bleed cover + 하단 fade gradient.
 *  - 좌/우 화살표 / dot pagination 은 패널 하단 고정 offset.
 *
 * **포스터 자연 비율 fit** — 포스터 PNG (1235×1643, ≈ 0.7517) 의 비율을 유지하면서
 * viewport 폭을 가득 채우도록 panelHeight 자체를 동적 계산. 포스터가 잘리지도 않고
 * 작아 보이지도 않음 (이전 'cover'+고정 panelHeight 는 잘림, 'contain' 은 빈 영역
 * 큼). 결과: hero 가 viewport 보다 작을 수 있어 다음 섹션 일부가 자연 노출되며
 * 스크롤을 유도.
 *
 * 포스터는 `src/data/posters.ts` 의 `POSTERS` 배열을 따라간다. 갯수에 따라
 * dot 수와 화살표 표시 여부가 자동 결정 (1장이면 dot/화살표 숨김).
 */
import React, { useState } from 'react';
import { Image, View, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { POSTERS } from '@data/posters';

const HEADER_HEIGHT = 60;
// 포스터 PNG 자연 비율 (assets/images/posters/축제포스터_사이즈.png — IHDR 1235×1643).
// 포스터 교체 시 새 이미지의 width/height 비율로 갱신.
const POSTER_RATIO = 1235 / 1643; // ≈ 0.7517
// Figma 패널 높이 596 기준 비율/오프셋.
const FADE_RATIO = 287 / 536; // 포스터 영역 대비 fade 영역 비율
const ARROW_FROM_BOTTOM = 42; // Figma 596 - 554
const DOT_FROM_BOTTOM = 31;   // Figma 596 - 565
// 데스크탑(≥701px)에선 global.css 의 .mobile-content 가 max-width 402 로 hero
// 컨테이너 폭을 capping. useWindowDimensions().width 는 브라우저 viewport 전체라
// hero 실제 폭과 다를 수 있음 — Math.min 으로 컨테이너 폭 보정.
const MOBILE_CONTENT_MAX_WIDTH = 402;
// SSR/static 첫 렌더 시 vw=0 fallback (Figma base width).
const FALLBACK_VW = 402;

// 헤더 가운데 미드나잇 가로 로고 — intrinsic 1696×729 (≈ 2.326).
const HEADER_LOGO_SOURCE = require('../../../assets/images/logo/미드나잇로고_가로.png');
const HEADER_LOGO_ASPECT_RATIO = 1696 / 729;
const HEADER_LOGO_HEIGHT = 28;
const HEADER_LOGO_WIDTH = Math.round(HEADER_LOGO_HEIGHT * HEADER_LOGO_ASPECT_RATIO);

export function HeroSection() {
  const navigation = useNavigation();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 포스터 자연 비율 기반 panelHeight — 폭 fit + 자연 height. 잘림 없음, 빈 영역 없음.
  // 데스크탑 viewport 가 클 때도 mobile-content 의 max-width 402 로 capping.
  const { width: vw } = useWindowDimensions();
  const safeVw = vw > 0 ? vw : FALLBACK_VW;
  const containerWidth = Math.min(safeVw, MOBILE_CONTENT_MAX_WIDTH);
  const posterHeight = containerWidth / POSTER_RATIO;
  const panelHeight = HEADER_HEIGHT + posterHeight;
  const fadeHeight = Math.round(posterHeight * FADE_RATIO);
  const arrowTop = panelHeight - ARROW_FROM_BOTTOM;
  const dotTop = panelHeight - DOT_FROM_BOTTOM;

  const posterCount = POSTERS.length;
  // POSTERS 가 비어있는 edge case 방어 — 빈 배열이면 화살표/dot 도 안 그리고 이미지도 미표시.
  const safeIndex = posterCount > 0 ? currentIndex % posterCount : 0;
  const currentPoster = POSTERS[safeIndex];
  const showControls = posterCount > 1;

  const goPrev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : posterCount - 1));
  const goNext = () => setCurrentIndex((i) => (i < posterCount - 1 ? i + 1 : 0));

  return (
    <View className="bg-festival-card w-full" style={{ height: panelHeight }}>
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

      {/* 메인 포스터 — 헤더 아래 full-bleed. panelHeight 가 자연 비율 fit 이므로
          cover/contain 동일 결과 (잘림 없이 폭 가득). 영역 탭 시 지도 이동. */}
      <Pressable
        onPress={() => router.navigate('/(tabs)/booth' as never)}
        accessibilityRole="link"
        accessibilityLabel="지도로 이동"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: HEADER_HEIGHT,
          height: posterHeight,
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
          height={fadeHeight}
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
          {/* 좌측 화살표 — 패널 하단에서 ARROW_FROM_BOTTOM(42)px 위 */}
          <Pressable
            onPress={goPrev}
            style={{ position: 'absolute', left: 14, top: arrowTop, width: 28, height: 28, zIndex: 2 }}
            className="items-center justify-center active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="이전 포스터"
          >
            <Ionicons name="chevron-back" size={28} color="#010070" />
          </Pressable>

          {/* 우측 화살표 — left:14 좌측과 대칭. */}
          <Pressable
            onPress={goNext}
            style={{ position: 'absolute', right: 14, top: arrowTop, width: 28, height: 28, zIndex: 2 }}
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
              top: dotTop,
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
