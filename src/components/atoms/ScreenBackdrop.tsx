/**
 * ScreenBackdrop - 네이비 배경 + 장식 GradientBlob preset
 *
 * 홈/라인업/부스/공지/분실물/Information 화면이 공유하는 그라디언트 원 배치를 variant로 추출.
 * 각 variant의 blob 좌표는 Figma(fileKey PliY3iLMWd1VZcXXNSdvDx) 원본 노드에서 추출.
 *
 * 각 blob은 서로 다른 주기/위상으로 잔잔한 드리프트(±12px)를 반복한다.
 * OS "동작 줄이기" 설정이 켜져 있으면 애니메이션을 스킵하고 정적으로 렌더한다.
 */
import React, { useEffect, useState } from 'react';
import { View, AccessibilityInfo, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { GradientBlob } from './GradientBlob';

export type ScreenBackdropVariant =
  | 'home'
  | 'lineup'
  | 'booth'
  | 'booth-detail'
  | 'announcement'
  | 'lost-found'
  | 'information'
  | 'menu'
  | 'timetable'
  | 'plain';

interface BlobSpec {
  size: number;
  top: number;
  left: number;
  rotate?: number;
  reversed?: boolean;
}

/**
 * Figma 1629:1165 — "배경 그라디언트 원 1500 사이즈" 공용 backdrop.
 * 스플래시 / Information 을 제외한 모든 화면이 공유한다.
 * 4번째 blob(top 1353)은 일반 viewport 아래에 배치되므로, 스크롤이 긴 화면(홈 네이비 영역 등)에서만 노출된다.
 */
const UNIFIED_BLOBS: BlobSpec[] = [
  { size: 154, top: 160, left: 275 },
  { size: 92, top: 448, left: -17, reversed: true },
  { size: 289, top: 745, left: 257 },
  { size: 175, top: 1353, left: -68, rotate: 77.39, reversed: true },
];

const PRESETS: Record<ScreenBackdropVariant, BlobSpec[]> = {
  home: UNIFIED_BLOBS,
  lineup: UNIFIED_BLOBS,
  booth: UNIFIED_BLOBS,
  'booth-detail': UNIFIED_BLOBS,
  announcement: UNIFIED_BLOBS,
  'lost-found': UNIFIED_BLOBS,
  menu: UNIFIED_BLOBS,
  timetable: UNIFIED_BLOBS,
  plain: UNIFIED_BLOBS,
  // Figma 920:4712 — Information 은 blob 을 카드 foreground 로 렌더(InformationContent 내부에서 처리)
  information: [],
};

/**
 * 각 blob이 받는 드리프트 파라미터. idx에 따라 위상을 엇갈리게 해서 자연스러운 비동기 움직임을 만든다.
 */
function driftParamsFor(idx: number) {
  return {
    durationX: 7000 + (idx % 4) * 1500, // 7.0s ~ 11.5s
    durationY: 9500 + (idx % 3) * 1000, // 9.5s ~ 11.5s
    delayX: (idx * 400) % 2000,
    delayY: (idx * 650) % 2000,
    amplitude: 12,
  };
}

interface AnimatedBlobProps {
  spec: BlobSpec;
  idx: number;
  variant: ScreenBackdropVariant;
  animate: boolean;
}

function AnimatedBlob({ spec, idx, variant, animate }: AnimatedBlobProps) {
  const params = driftParamsFor(idx);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      tx.value = 0;
      ty.value = 0;
      return;
    }
    tx.value = withDelay(
      params.delayX,
      withRepeat(
        withTiming(params.amplitude, {
          duration: params.durationX,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      ),
    );
    ty.value = withDelay(
      params.delayY,
      withRepeat(
        withTiming(params.amplitude, {
          duration: params.durationY,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      ),
    );
    return () => {
      cancelAnimation(tx);
      cancelAnimation(ty);
    };
  }, [animate, params.amplitude, params.delayX, params.delayY, params.durationX, params.durationY, tx, ty]);

  const animatedStyle = useAnimatedStyle(() => {
    // 회전을 먼저 적용하고 그 다음 드리프트 — 이동 축이 화면 기준으로 유지되도록.
    const base: any[] = [];
    if (spec.rotate) base.push({ rotate: `${spec.rotate}deg` });
    base.push({ translateX: tx.value - params.amplitude / 2 });
    base.push({ translateY: ty.value - params.amplitude / 2 });
    return { transform: base };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: spec.top,
          left: spec.left,
          width: spec.size,
          height: spec.size,
        },
        animatedStyle,
      ]}
    >
      <GradientBlob
        size={spec.size}
        gradientId={`backdrop-${variant}-${idx}`}
        reversed={spec.reversed}
      />
    </Animated.View>
  );
}

export interface ScreenBackdropProps {
  variant: ScreenBackdropVariant;
}

/**
 * 절대 위치 레이어로 렌더. 부모(화면 컨테이너)에 `overflow: hidden`을 두고,
 * 이 컴포넌트를 콘텐츠보다 먼저 렌더하면 뒷배경으로 깔린다.
 */
export function ScreenBackdrop({ variant }: ScreenBackdropProps) {
  const blobs = PRESETS[variant];
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
      // RN <0.65 호환: addEventListener가 subscription 객체를 반환
      if (sub && typeof (sub as any).remove === 'function') (sub as any).remove();
    };
  }, []);

  // web에서 Reanimated가 드물게 레이아웃 관측 이슈를 내면, Platform 분기로 폴백 가능.
  // 현재는 모바일 웹도 충분히 돌리는 범위라 공통 적용.
  const animate = !reduceMotion;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      {blobs.map((b, idx) => (
        <AnimatedBlob
          key={idx}
          spec={b}
          idx={idx}
          variant={variant}
          animate={animate}
        />
      ))}
    </View>
  );
}
