/**
 * HeroSection - 홈 상단 패널 (Figma 2139:753)
 *
 * 새 시안:
 *  - 0~60: 흰색 헤더 (햄버거 좌측 + 미드나잇 가로 로고 가운데)
 *  - 60~패널끝: 메인 포스터 이미지 full-bleed (cover) + 하단 그라디언트로
 *    primary-light(#C3EDFF) 페이드. 다음 섹션과 자연스럽게 이어짐.
 *  - 좌/우 화살표 / dot pagination 은 패널 하단 고정 offset (Figma 596 기준 42, 31).
 *
 * **viewport-adaptive 패널 높이** — Figma 596 고정값을 쓰면 휴대폰 viewport 가
 * 596 보다 작거나 비슷한 기기에서 화살표/dot 이 화면 밖으로 밀려 사용자가 스크롤해야
 * 보이는 문제. useWindowDimensions + SafeArea top inset 으로 viewport 한 화면을
 * 정확히 차지하도록 동적 계산. 다음 섹션은 스크롤 후 등장.
 *
 * 포스터는 `src/data/posters.ts` 의 `POSTERS` 배열을 따라간다. 갯수에 따라
 * dot 수와 화살표 표시 여부가 자동 결정 (1장이면 dot/화살표 숨김).
 */
import React, { useState } from 'react';
import { Image, View, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { POSTERS } from '@data/posters';

const HEADER_HEIGHT = 60;
// Figma 패널 높이 596 기준 비율/오프셋. viewport adaptive 시 보정에 사용.
const FADE_RATIO = 287 / 536; // 포스터 영역 대비 fade 영역 비율
const ARROW_FROM_BOTTOM = 42; // Figma 596 - 554
const DOT_FROM_BOTTOM = 31;   // Figma 596 - 565

// 헤더 가운데 미드나잇 가로 로고 — intrinsic 1696×729 (≈ 2.326).
const HEADER_LOGO_SOURCE = require('../../../assets/images/logo/미드나잇로고_가로.png');
const HEADER_LOGO_ASPECT_RATIO = 1696 / 729;
const HEADER_LOGO_HEIGHT = 28;
const HEADER_LOGO_WIDTH = Math.round(HEADER_LOGO_HEIGHT * HEADER_LOGO_ASPECT_RATIO);

export function HeroSection() {
  const navigation = useNavigation();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  // SafeArea top 만큼 ScrollScreenTemplate 가 이미 padding — 그 아래로 한 viewport 차지.
  // ⚠️ web SSR/static 첫 렌더 시 windowHeight = 0 → panelHeight 0 → hero invisible.
  // 0 일 땐 fallback 800 (모바일 일반 viewport) 사용. mount 후 hydrate 되며 실제 값으로 갱신.
  const panelHeight = windowHeight > 0 ? Math.max(0, windowHeight - insets.top) : 800;
  const posterHeight = Math.max(0, panelHeight - HEADER_HEIGHT);
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

      {/* 메인 포스터 — 헤더 아래 full-bleed contain. 포스터 영역 탭 시 지도(/booth)
          로 이동. 화살표/dot 은 zIndex 2 로 위에 있어 자체 onPress 가 우선.
          contain: 포스터 자연 비율(1235×1643 ≈ 0.7517) 유지 — viewport 비율과
          어긋나도 포스터 콘텐츠(텍스트/USW 로고) 가 잘리지 않음. 빈 영역은
          backgroundColor #C3EDFF 로 채워 fade gradient + 다음 섹션과 자연 연결. */}
      <Pressable
        onPress={() => router.navigate('/(tabs)/booth' as never)}
        accessibilityRole="link"
        accessibilityLabel="지도로 이동"
        className="bg-festival-primary-light"
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
            resizeMode="contain"
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

          {/* 우측 화살표 — left:14 좌측과 대칭. left:360 고정값을 쓰면 viewport <402 인 SE 에서 잘림. */}
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
