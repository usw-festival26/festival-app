/**
 * SplashContent - 스플래시 화면 (Figma 920:3825 ↔ 962:656)
 *
 * 레이아웃: Figma 좌표 그대로 (mobile-content max-width 402px와 일치)
 * Blob: 공용 GradientBlob(grainIntensity='soft') + Reanimated 로 두 포즈 사이 드리프트.
 *   920:3825 (초기) ↔ 962:656 (드리프트 종점) 24초 주기 왕복.
 * 트랜지션: 터치 → blur(web) + scale + lavender wash, ease-out-expo, 620ms
 */
import React, { useEffect, useState } from 'react';
import { Pressable, View, StyleSheet, Platform, Text, AccessibilityInfo } from 'react-native';
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

interface DriftSpec {
  size: number;
  gradientId: string;
  reversed?: boolean;
  fromLeft: number;
  fromTop: number;
  fromRotate: number;
  toLeft: number;
  toTop: number;
  toRotate: number;
}

// 포즈 비교: 920:3825 (from) ↔ 962:656 (to).
// Figma 좌표를 center-of-circle 기준으로 환산해 size/2 를 빼 top-left 로 저장.
// from: Figma 920:3825 의 각 노드 최외곽 rect.
// to: Figma 962:656 의 flex-centered 컨테이너에서 원 중심 좌표를 추출.
const BLOBS: DriftSpec[] = [
  // Ellipse 68 (154) — 920:5031 ↔ 962:659.
  // from: left:271, top:-29, rotate 0
  // to: center (30, 181), rotate -167.65° → left: -47, top: 104
  {
    size: 154,
    gradientId: 'splash-68',
    fromLeft: 271,
    fromTop: -29,
    fromRotate: 0,
    toLeft: -47,
    toTop: 104,
    toRotate: -167.65,
  },
  // Ellipse 69 (92) — 920:5033 ↔ 962:661. reversed 그라디언트.
  // from: container(left:-28,top:314,size:92) + rotate 90° → center (18, 360), left:-28, top:314
  // to: center (381.74, 504.74), rotate -117.93° → left: 336, top: 459
  {
    size: 92,
    gradientId: 'splash-69',
    reversed: true,
    fromLeft: -28,
    fromTop: 314,
    fromRotate: 90,
    toLeft: 336,
    toTop: 459,
    toRotate: -117.93,
  },
  // Ellipse 70 (289) — 920:5032 ↔ 962:660.
  // from: left:201, top:709, rotate 0
  // to: center (29.65, 615.65), rotate -90.46° → left: -115, top: 471
  {
    size: 289,
    gradientId: 'splash-70',
    fromLeft: 201,
    fromTop: 709,
    fromRotate: 0,
    toLeft: -115,
    toTop: 471,
    toRotate: -90.46,
  },
];

interface DriftBlobProps {
  spec: DriftSpec;
  drift: SharedValue<number>;
}

function DriftBlob({ spec, drift }: DriftBlobProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const left = interpolate(drift.value, [0, 1], [spec.fromLeft, spec.toLeft]);
    const top = interpolate(drift.value, [0, 1], [spec.fromTop, spec.toTop]);
    const rotate = interpolate(drift.value, [0, 1], [spec.fromRotate, spec.toRotate]);
    return {
      position: 'absolute',
      left,
      top,
      width: spec.size,
      height: spec.size,
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View pointerEvents="none" style={animatedStyle}>
      <GradientBlob
        size={spec.size}
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

  // Content layer: scale up + delayed fade
  const containerStyle = useAnimatedStyle(() => {
    const fadeStart = 0.32; // ~200ms / 620ms
    const fade =
      progress.value <= fadeStart
        ? 1
        : 1 - (progress.value - fadeStart) / (1 - fadeStart);
    const scale = IS_WEB
      ? interpolate(progress.value, [0, 1], [1, 1.06])
      : interpolate(progress.value, [0, 1], [1, 1.1]);
    const pressScale = 1 - pressed.value * 0.015;
    return {
      flex: 1,
      opacity: fade,
      transform: [{ scale: scale * pressScale }],
    };
  });

  // Lavender wash
  const washStyle = useAnimatedStyle(() => {
    const target = IS_WEB ? 0.35 : 0.55;
    return {
      opacity: progress.value * target,
      transform: [{ translateY: -8 * progress.value }],
    };
  });

  // Web-only blur layer
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
      style={styles.root}
      className="bg-festival-primary-dark"
    >
      <Animated.View style={containerStyle}>
        {BLOBS.map((spec) => (
          <DriftBlob key={spec.gradientId} spec={spec} drift={drift} />
        ))}

        {/* MAIN / LOGO — 920:3826 (x:54, y:360, w:294, h:154)
            AppText는 variant=body 기본값이 fontSize 16/color #000을 강제 주입하므로
            여기서는 RN <Text>를 직접 사용. */}
        <View pointerEvents="none" style={styles.logoWrap}>
          <Text style={styles.logoText}>MAIN</Text>
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        {/* 터치 안내 — 920:3827 (y:761) */}
        <View pointerEvents="none" style={styles.hintWrap}>
          <AppText className="text-[12px] text-white text-center font-pretendard">
            화면을 터치해주세요
          </AppText>
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

  logoWrap: {
    position: 'absolute',
    left: 54,
    top: 360,
    width: 294,
    height: 154,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: Platform.select({ web: 'Roboto', default: 'Roboto_900Black' }),
    fontWeight: '900',
    fontSize: 48,
    lineHeight: 40,
    letterSpacing: 0,
    color: '#E0DCFF',
    textAlign: 'center',
  },

  hintWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 761,
    alignItems: 'center',
  },
});
