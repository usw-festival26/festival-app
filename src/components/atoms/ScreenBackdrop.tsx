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
  | 'information';

interface BlobSpec {
  size: number;
  top: number;
  left: number;
  rotate?: number;
  reversed?: boolean;
}

const PRESETS: Record<ScreenBackdropVariant, BlobSpec[]> = {
  // Figma 1334:802 — 홈 네이비 영역
  home: [
    { size: 92, top: 594, left: -3, rotate: 90, reversed: true },
    { size: 289, top: 748, left: 283 },
  ],
  // Figma 1014:465 — 라인업
  lineup: [
    { size: 154, top: 160, left: 275 },
    { size: 92, top: 448, left: -17, reversed: true },
    { size: 289, top: 985, left: 260 },
  ],
  // Figma 1272:1566 — 부스 리스트
  booth: [
    { size: 155, top: 61, left: -297, rotate: 75.84, reversed: true },
    { size: 91, top: 184, left: -21, rotate: 83.97, reversed: true },
    { size: 347, top: 371, left: 186, rotate: -5.14 },
    { size: 248, top: 429, left: -399, rotate: 49.2 },
    { size: 283, top: 679, left: -730, rotate: 39.55 },
    { size: 202, top: 782, left: -72, rotate: -68.17 },
  ],
  // Figma 1272:1632 — 부스 상세
  'booth-detail': [
    { size: 118, top: 67, left: -60, rotate: 71.04, reversed: true },
    { size: 270, top: 385, left: 192 },
    { size: 209, top: 692, left: -96, rotate: -10.5 },
  ],
  // Figma 920:4490 — 공지
  announcement: [
    { size: 154, top: 172, left: 272 },
    { size: 92, top: 467, left: -3, rotate: 90, reversed: true },
    { size: 289, top: 896, left: 283 },
  ],
  // Figma 1228:1018 — 분실물
  'lost-found': [
    { size: 289, top: 128, left: 204 },
    { size: 92, top: 146, left: -35, rotate: 88.7, reversed: true },
  ],
  // Figma 1228:1182 — Information
  information: [
    { size: 154, top: 231, left: 272 },
    { size: 92, top: 526, left: -3, rotate: 90, reversed: true },
    { size: 289, top: 955, left: 283 },
  ],
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
