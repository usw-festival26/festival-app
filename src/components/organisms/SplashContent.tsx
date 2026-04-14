/**
 * SplashContent - 스플래시 화면 (Figma 920:3825, frame 402×874)
 *
 * 레이아웃: Figma 좌표 그대로 (mobile-content max-width 402px와 일치)
 * 트랜지션: 터치 → blur(web) + scale + lavender wash, ease-out-expo, 620ms
 */
import React from 'react';
import { Pressable, View, StyleSheet, Platform, Text } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { AppText } from '@atoms/AppText';

export interface SplashContentProps {
  onPress: () => void;
}

const TRANSITION_MS = 620;
const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const IS_WEB = Platform.OS === 'web';

interface BlobProps {
  size: number;
  gradientId: string;
  reversed?: boolean;
}

function Blob({ size, gradientId, reversed }: BlobProps) {
  const [start, end] = reversed ? ['#0D00FF', '#FFBEBF'] : ['#FFBEBF', '#0D00FF'];
  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={start} />
          <Stop offset="100%" stopColor={end} />
        </LinearGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${gradientId})`} />
    </Svg>
  );
}

export function SplashContent({ onPress }: SplashContentProps) {
  const progress = useSharedValue(0);
  const pressed = useSharedValue(0);

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
        {/* 우상단 blob 154 — Ellipse 68 (x:271, y:-29) */}
        <View pointerEvents="none" style={styles.blobTopRight}>
          <Blob size={154} gradientId="grad-tr" />
        </View>

        {/* 우하단 blob 289 — Ellipse 70 (x:283, y:627) */}
        <View pointerEvents="none" style={styles.blobBottomRight}>
          <Blob size={289} gradientId="grad-br" />
        </View>

        {/* 좌중앙 blob 92 — Ellipse 69 (x:-3, y:473, rotate 90°) */}
        <View pointerEvents="none" style={styles.blobLeftMid}>
          <Blob size={92} gradientId="grad-lm" reversed />
        </View>

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

  blobTopRight: { position: 'absolute', left: 271, top: -29 },
  blobBottomRight: { position: 'absolute', left: 283, top: 627 },
  blobLeftMid: { position: 'absolute', left: -3, top: 473 },

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
