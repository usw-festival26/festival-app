/**
 * SplashContent - 스플래시 화면 (Figma 920:3825 ↔ 962:656)
 *
 * 레이아웃 (flex column, 절대좌표·transform scale 폐기):
 *  - 위쪽 spacer (flex:1) + 가운데 로고/슬로건 그룹 + 가운데 spacer (flex:1)
 *    + 하단 hint+credit. paddingTop/Bottom 으로 safe area 보정.
 *  - blob 3개는 viewport 비율 좌표(vw, vh 대비 %) 로 absolute 배치
 *    → 어떤 viewport 에서도 비례 시각 분포 유지.
 *  - root 의 height = 100svh (web). 모바일 브라우저 nav bar 가 보이는 상태의
 *    minimum viewport 에 항상 fit → hint/credit 잘림 없음. 미지원 브라우저는
 *    부모 mobile-content > div { height:100% } 으로 자연 fallback.
 *
 * Blob drift: 24초 주기 from↔to pose 사이 sin-eased 왕복 (Reanimated 워클릿)
 * 트랜지션: 터치 → blur(web) + scale + lavender wash, ease-out-expo, 620ms
 * 접근성: AccessibilityInfo.isReduceMotionEnabled true 면 drift 정지
 */
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  Platform,
  Image,
  AccessibilityInfo,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  runOnJS,
  Easing,
  interpolate,
  cancelAnimation,
  type SharedValue,
} from 'react-native-reanimated';
import { AppText } from '@atoms/AppText';
import { GradientBlob } from '@atoms/GradientBlob';

export interface SplashContentProps {
  onPress: () => void;
}

const TRANSITION_MS = 620;
const DRIFT_MS = 24000;
const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const IS_WEB = Platform.OS === 'web';

// 트랜지션 종점 — useAnimatedStyle 워클릿 안에서 IS_WEB 분기 매 프레임 평가 회피.
const CONTENT_SCALE_END = IS_WEB ? 1.06 : 1.1;
const WASH_OPACITY_END = IS_WEB ? 0.35 : 0.55;
const FADE_START = 0.32; // ~200ms / 620ms

// Web 한정 root height = 100svh (smallest viewport height).
// 모바일 브라우저 nav/address bar 가 보이는 상태의 minimum viewport 에 root 가
// 항상 fit → 그 안의 모든 자식이 visible 안 보장. iOS Safari 15.4+ /
// Android Chrome 108+ 미지원 브라우저는 무시되어 부모의 height:100% 로 자연 fallback.
const ROOT_WEB_STYLE = IS_WEB
  ? ({ height: '100svh' as unknown as number, minHeight: '100svh' as unknown as number })
  : null;

// Figma 디자인 base — blob 좌표/사이즈 환산 기준.
const FIGMA_W = 402;
const FIGMA_H = 832;

interface DriftSpec {
  /** vw 대비 blob 사이즈 비율 */
  sizeRatio: number;
  gradientId: string;
  reversed?: boolean;
  /** from pose: viewport (vw, vh) 대비 left/top 비율 + rotate(deg) */
  fromXRatio: number;
  fromYRatio: number;
  fromRotate: number;
  /** to pose */
  toXRatio: number;
  toYRatio: number;
  toRotate: number;
}

// Figma 920:3825 (from) ↔ 962:656 (to) 의 blob 위치/사이즈를 viewport 비율로 환산.
// 사이즈는 vw 기준 (vw 가 작아지면 blob 도 비례 축소). 위치는 vw, vh 각각 비율.
const BLOBS: DriftSpec[] = [
  // Ellipse 68 (size 154) — 우상단
  {
    sizeRatio: 154 / FIGMA_W,
    gradientId: 'splash-68',
    fromXRatio: 271 / FIGMA_W,
    fromYRatio: -29 / FIGMA_H,
    fromRotate: 0,
    toXRatio: -47 / FIGMA_W,
    toYRatio: 104 / FIGMA_H,
    toRotate: -167.65,
  },
  // Ellipse 69 (size 92) — 좌중간 (반전 그라디언트)
  {
    sizeRatio: 92 / FIGMA_W,
    gradientId: 'splash-69',
    reversed: true,
    fromXRatio: -28 / FIGMA_W,
    fromYRatio: 314 / FIGMA_H,
    fromRotate: 90,
    toXRatio: 336 / FIGMA_W,
    toYRatio: 459 / FIGMA_H,
    toRotate: -117.93,
  },
  // Ellipse 70 (size 289) — 하단
  {
    sizeRatio: 289 / FIGMA_W,
    gradientId: 'splash-70',
    fromXRatio: 201 / FIGMA_W,
    fromYRatio: 709 / FIGMA_H,
    fromRotate: 0,
    toXRatio: -115 / FIGMA_W,
    toYRatio: 471 / FIGMA_H,
    toRotate: -90.46,
  },
];

interface DriftBlobProps {
  spec: DriftSpec;
  drift: SharedValue<number>;
  vw: number;
  vh: number;
}

function DriftBlob({ spec, drift, vw, vh }: DriftBlobProps) {
  const size = vw * spec.sizeRatio;
  const fromLeft = vw * spec.fromXRatio;
  const fromTop = vh * spec.fromYRatio;
  const toLeft = vw * spec.toXRatio;
  const toTop = vh * spec.toYRatio;

  const animatedStyle = useAnimatedStyle(() => {
    const left = interpolate(drift.value, [0, 1], [fromLeft, toLeft]);
    const top = interpolate(drift.value, [0, 1], [fromTop, toTop]);
    const rotate = interpolate(drift.value, [0, 1], [spec.fromRotate, spec.toRotate]);
    return {
      position: 'absolute',
      left,
      top,
      width: size,
      height: size,
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View pointerEvents="none" style={animatedStyle}>
      <GradientBlob
        size={size}
        gradientId={spec.gradientId}
        reversed={spec.reversed}
        grainIntensity="soft"
      />
    </Animated.View>
  );
}

export function SplashContent({ onPress }: SplashContentProps) {
  const progress = useSharedValue(0);
  const pressed = useSharedValue(0);
  const drift = useSharedValue(0);
  const [reduceMotion, setReduceMotion] = useState(true);
  const insets = useSafeAreaInsets();
  const { width: vw, height: vh } = useWindowDimensions();

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setReduceMotion(enabled);
    });
    return () => {
      mounted = false;
      if (sub && typeof (sub as any).remove === 'function') (sub as any).remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      drift.value = 0;
      return;
    }
    drift.value = withRepeat(
      withTiming(1, { duration: DRIFT_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => {
      cancelAnimation(drift);
    };
  }, [reduceMotion, drift]);

  const containerStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const fade = p <= FADE_START ? 1 : 1 - (p - FADE_START) / (1 - FADE_START);
    const scale = interpolate(p, [0, 1], [1, CONTENT_SCALE_END]);
    const pressScale = 1 - pressed.value * 0.015;
    return {
      flex: 1,
      opacity: fade,
      transform: [{ scale: scale * pressScale }],
    };
  });

  const washStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: p * WASH_OPACITY_END,
      transform: [{ translateY: -8 * p }],
    };
  });

  const blurStyle = useAnimatedStyle(() => {
    const px = progress.value * 24;
    return {
      backdropFilter: `blur(${px}px)`,
      WebkitBackdropFilter: `blur(${px}px)`,
      opacity: 1,
    } as any;
  });

  const handlePressIn = () => {
    pressed.value = withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) });
  };
  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.quad) });
  };
  const handlePress = () => {
    progress.value = withTiming(
      1,
      { duration: TRANSITION_MS, easing: EASE_OUT_EXPO },
      (finished) => {
        if (finished) runOnJS(onPress)();
      },
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.root, ROOT_WEB_STYLE]}
      className="bg-festival-primary-light"
    >
      <Animated.View style={containerStyle}>
        {/* Background blob layer — viewport 전체 absolute */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {BLOBS.map((spec) => (
            <DriftBlob key={spec.gradientId} spec={spec} drift={drift} vw={vw} vh={vh} />
          ))}
        </View>

        {/* Foreground content — flex column 자연 정렬 */}
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 24,
            alignItems: 'center',
          }}
        >
          {/* 위쪽 spacer */}
          <View style={{ flex: 1 }} />

          {/* 중앙 로고 + 텍스트 그룹 */}
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../../assets/images/logo/미드나잇로고_검정.png')}
              style={{ width: 253, height: 238, opacity: 0.9 }}
              resizeMode="cover"
              accessibilityLabel="미드나잇 로고"
            />
            <Image
              source={require('../../../assets/images/text/2026수원대대동제.png')}
              style={{ width: 108, height: 10, marginTop: 22 }}
              resizeMode="contain"
              accessibilityLabel="2026 수원대학교 대동제"
            />
            <Image
              source={require('../../../assets/images/text/짙은밤,가장빛나는순간.png')}
              style={{ width: 284, height: 26, marginTop: 7 }}
              resizeMode="contain"
              accessibilityLabel=":짙은 밤, 가장 빛나는 순간"
            />
            <Image
              source={require('../../../assets/images/text/날짜.png')}
              style={{ width: 68, height: 9, marginTop: 13 }}
              resizeMode="contain"
              accessibilityLabel="05.14-05.15"
            />
          </View>

          {/* 아래쪽 spacer */}
          <View style={{ flex: 1 }} />

          {/* 하단 hint + credit */}
          <View style={{ alignItems: 'center' }}>
            <AppText
              className="text-[12px] leading-[12px] text-center font-pretendard"
              style={{ color: '#004466' }}
            >
              화면을 터치해주세요
            </AppText>
            <Image
              source={require('../../../assets/images/text/2026TUoSF.png')}
              style={{ width: 137, height: 8, marginTop: 24 }}
              resizeMode="contain"
              accessibilityLabel="2026 The University of Suwon Festival"
            />
          </View>
        </View>
      </Animated.View>

      {/* Web 전용 backdrop blur */}
      {IS_WEB && (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, blurStyle]}
        />
      )}

      {/* 라벤더 wash */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, washStyle]}
        className="bg-festival-lavender"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
});
