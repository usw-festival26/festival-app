/**
 * SplashContent - 스플래시 화면 (Figma 920:3825 ↔ 962:656)
 *
 * 레이아웃: Figma 좌표 그대로 (mobile-content max-width 402px와 일치)
 * Blob: 공용 GradientBlob(grainIntensity='soft') + Reanimated 로 두 포즈 사이 드리프트.
 *   920:3825 (초기) ↔ 962:656 (드리프트 종점) 24초 주기 왕복.
 * 트랜지션: 터치 → blur(web) + scale + lavender wash, ease-out-expo, 620ms
 */
import React, { useEffect, useState } from 'react';
import { Pressable, View, StyleSheet, Platform, Image, AccessibilityInfo, useWindowDimensions } from 'react-native';
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

// Figma 디자인 base 사이즈 — 모든 absolute 좌표가 이 캔버스 기준.
// viewport 가 이보다 작으면 stage 컨테이너 전체를 비례 축소 (transform scale).
const FIGMA_BASE_WIDTH = 402;
const FIGMA_BASE_HEIGHT = 832;

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

  // viewport-adaptive scale — Figma base(402×832) 가 viewport 보다 크면 비례 축소.
  // 큰 화면에선 scale 1 유지 (디자인 의도 그대로). stage 가운데 정렬.
  const insets = useSafeAreaInsets();
  const { width: vw, height: vh } = useWindowDimensions();
  const availH = Math.max(0, vh - insets.top - insets.bottom);
  const stageScale = Math.min(vw / FIGMA_BASE_WIDTH, availH / FIGMA_BASE_HEIGHT, 1);
  const stageMarginTop = Math.max(0, (availH - FIGMA_BASE_HEIGHT * stageScale) / 2);

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
      className="bg-festival-primary-light"
    >
      <Animated.View style={containerStyle}>
        {/* Stage — Figma base 캔버스(402×832). viewport 가 작으면 비례 축소.
            외부 wrapper 는 scaled 사이즈로 layout 가운데 정렬, 내부는 원본 좌표 +
            transform-origin top-left scale — children 의 absolute top:797 등이 visual
            로도 정확히 stage 끝에 위치하도록. */}
        <View
          style={{
            width: FIGMA_BASE_WIDTH * stageScale,
            height: FIGMA_BASE_HEIGHT * stageScale,
            alignSelf: 'center',
            marginTop: stageMarginTop,
          }}
        >
          <View
            style={{
              width: FIGMA_BASE_WIDTH,
              height: FIGMA_BASE_HEIGHT,
              transform: [{ scale: stageScale }],
              // transformOrigin 은 web 전용 CSS — native(iOS/Android) 는 미지원이므로 IS_WEB 일 때만 spread.
              // (native 에선 default 가 center 라 알맞은 위치가 아니지만, native 에서도 viewport 가 base 보다 큰 경우만 scale=1 로 동작하므로 시각 영향 적음.)
              ...(IS_WEB ? { transformOrigin: 'top left' } : null),
            }}
          >
        {BLOBS.map((spec) => (
          <DriftBlob key={spec.gradientId} spec={spec} drift={drift} />
        ))}

        {/* 미드나잇 로고 — Figma 2139:746 / 2182:808 (x:75, y:275, 253×238).
            검정 변형 PNG 를 cover + opacity 0.9 로 채움. */}
        <View pointerEvents="none" style={styles.logoWrap}>
          <Image
            source={require('../../../assets/images/logo/미드나잇로고_검정.png')}
            style={{ width: '100%', height: '100%', opacity: 0.9 }}
            resizeMode="cover"
            accessibilityLabel="미드나잇 로고"
          />
        </View>

        {/* 축제명 라벨 — Figma 2185:1536 (x:50, y:535, 108×10).
            Figma 에서 outline 된 텍스트라 폰트 메타가 없어 export PNG 를 그대로 사용. */}
        <View pointerEvents="none" style={styles.titleLabel}>
          <Image
            source={require('../../../assets/images/text/2026수원대대동제.png')}
            style={{ width: 108, height: 10 }}
            resizeMode="contain"
            accessibilityLabel="2026 수원대학교 대동제"
          />
        </View>

        {/* 메인 슬로건 — Figma 2185:1523 (x:50, y:552, 284×26). PNG export. */}
        <View pointerEvents="none" style={styles.slogan}>
          <Image
            source={require('../../../assets/images/text/짙은밤,가장빛나는순간.png')}
            style={{ width: 284, height: 26 }}
            resizeMode="contain"
            accessibilityLabel=":짙은 밤, 가장 빛나는 순간"
          />
        </View>

        {/* 날짜 — Figma 2185:1582 (x:50, y:591, 68×9). PNG export. */}
        <View pointerEvents="none" style={styles.date}>
          <Image
            source={require('../../../assets/images/text/날짜.png')}
            style={{ width: 68, height: 9 }}
            resizeMode="contain"
            accessibilityLabel="05.14-05.15"
          />
        </View>

        {/* 터치 안내 — Figma 2139:745 (y:761, color #046 = #004466).
            이건 outline 안 된 실제 텍스트라 그대로 둠 (폰트 정보 보유). */}
        <View pointerEvents="none" style={styles.hintWrap}>
          <AppText
            className="text-[12px] text-center font-pretendard"
            style={{ color: '#004466' }}
          >
            화면을 터치해주세요
          </AppText>
        </View>

        {/* 영문 푸터 — Figma 2185:1549 (x:133 center, y:797, 137×8). PNG export. */}
        <View pointerEvents="none" style={styles.creditWrap}>
          <Image
            source={require('../../../assets/images/text/2026TUoSF.png')}
            style={{ width: 137, height: 8 }}
            resizeMode="contain"
            accessibilityLabel="2026 The University of Suwon Festival"
          />
        </View>
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

  logoWrap: {
    position: 'absolute',
    left: 75,
    top: 275,
    width: 253,
    height: 238,
  },

  titleLabel: { position: 'absolute', left: 50, top: 535 },
  slogan: { position: 'absolute', left: 50, top: 552 },
  date: { position: 'absolute', left: 50, top: 591 },

  hintWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 761,
    alignItems: 'center',
  },

  creditWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 797,
    alignItems: 'center',
  },
});
