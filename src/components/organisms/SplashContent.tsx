/**
 * SplashContent - 스플래시 화면 (Figma 920:3825 ↔ 962:656)
 *
 * 레이아웃: Figma 좌표 그대로 (mobile-content max-width 402px와 일치)
 * Blob: 공용 GradientBlob(grainIntensity='soft') + Reanimated 로 두 포즈 사이 드리프트.
 *   920:3825 (초기) ↔ 962:656 (드리프트 종점) 24초 주기 왕복.
 * 트랜지션: 터치 → blur(web) + scale + lavender wash, ease-out-expo, 620ms
 */
import React, { useEffect, useMemo, useState } from 'react';
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

// Figma 디자인 base 사이즈 — stage 안 children 의 absolute 좌표가 이 캔버스 기준.
// viewport 가 이보다 작으면 stage 컨테이너 전체를 비례 축소 (transform scale).
const FIGMA_BASE_WIDTH = 402;
const FIGMA_BASE_HEIGHT = 832;

// 트랜지션 종점 상수 — useAnimatedStyle worklet 안에서 IS_WEB 분기를
// 매 프레임 평가하지 않도록 module-level 로 hoist.
const CONTENT_SCALE_END = IS_WEB ? 1.06 : 1.1;
const WASH_OPACITY_END = IS_WEB ? 0.35 : 0.55;
const FADE_START = 0.32; // ~200ms / 620ms — opacity fade 시작 지점

// stage 가 차지할 영역 = viewport - status bar 여백 - hint/credit 예약 공간.
// 이 reserve 만큼 stage 가 더 작게 scale 되어 viewport 안에서 hint area 와
// 겹치지 않고 hint/credit 가 항상 visible bottom 에 노출된다.
const STAGE_TOP_PADDING = 28;
const HINT_RESERVE = 96;
// hint/credit 의 viewport bottom 으로부터 거리. 브라우저 nav bar / gesture
// bar 와 안전하게 떨어지도록 hint 56, credit 24.
const HINT_BOTTOM = 56;
const CREDIT_BOTTOM = 24;

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

  // viewport-adaptive scale — stage 영역 = viewport - top padding - hint reserve.
  // stage 는 viewport 위쪽 정렬, hint/credit 는 stage 밖에서 viewport bottom 으로
  // anchor. 작은 viewport 에선 stage 가 height-limited 비율로 축소되어 hint area
  // 와 충돌하지 않고, 큰 viewport (안드로이드 등 vh > 850) 에선 stage 가 위쪽에
  // 붙어 보임. 이전 가운데 정렬은 큰 viewport 에서 hint 가 visible 영역 밖으로
  // 밀려 잘리는 회귀가 있어 폐기.
  // ⚠️ web SSR/static 첫 렌더에선 useWindowDimensions 가 0 을 반환할 수 있어
  // scale=0 → 콘텐츠 invisible 이슈. vw/availStageH 가 양수일 때만 scale 계산, 아니면 1.
  const insets = useSafeAreaInsets();
  const { width: vw, height: vh } = useWindowDimensions();
  const { stageScale, stageMarginTop } = useMemo(() => {
    const safeTop = insets.top + STAGE_TOP_PADDING;
    const safeBottom = insets.bottom + HINT_RESERVE;
    const availStageH = Math.max(0, vh - safeTop - safeBottom);
    const scale =
      vw > 0 && availStageH > 0
        ? Math.min(vw / FIGMA_BASE_WIDTH, availStageH / FIGMA_BASE_HEIGHT, 1)
        : 1;
    return { stageScale: scale, stageMarginTop: safeTop };
  }, [vw, vh, insets.top, insets.bottom]);

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

  // Lavender wash
  const washStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: p * WASH_OPACITY_END,
      transform: [{ translateY: -8 * p }],
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
            외부 wrapper 는 scaled 사이즈로 viewport top 정렬 (status bar 만큼만
            띄움). 내부는 원본 좌표 + transform-origin top-left scale 로 children
            의 absolute top 이 비례 보존됨. hint/credit 는 stage 밖에서 viewport
            bottom anchored. */}
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
          </View>
        </View>

        {/* 터치 안내 — viewport bottom anchored.
            과거에 stage 안 absolute top:761 로 두었더니 큰 viewport (안드로이드
            등 vh > 850) 에서 stage 가 viewport 가운데 정렬되며 hint 의 시각 y
            가 브라우저 nav bar 영역에 가려져 보이지 않는 회귀가 있었음.
            stage 밖으로 빼서 항상 viewport bottom 으로부터 일정 거리에 위치.
            leading-[12px] 로 line-height = font-size 일치 (baseline 패딩 제거). */}
        <View
          pointerEvents="none"
          style={[styles.hintWrap, { bottom: HINT_BOTTOM + insets.bottom }]}
        >
          <AppText
            className="text-[12px] leading-[12px] text-center font-pretendard"
            style={{ color: '#004466' }}
          >
            화면을 터치해주세요
          </AppText>
        </View>

        {/* 영문 푸터 — viewport bottom anchored (Figma 2185:1549). */}
        <View
          pointerEvents="none"
          style={[styles.creditWrap, { bottom: CREDIT_BOTTOM + insets.bottom }]}
        >
          <Image
            source={require('../../../assets/images/text/2026TUoSF.png')}
            style={{ width: 137, height: 8 }}
            resizeMode="contain"
            accessibilityLabel="2026 The University of Suwon Festival"
          />
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

  // viewport bottom anchored — bottom 값은 인라인에서 insets.bottom 합산.
  hintWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  creditWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
