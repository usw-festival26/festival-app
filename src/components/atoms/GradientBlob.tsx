/**
 * GradientBlob - 장식용 보케 그라디언트 원 (VectorCircle.png 기반)
 *
 * Figma 1629:1165 의 Vector 원본을 export 한 PNG 한 장을 공용으로 사용한다.
 * PNG 안에 원 + 그라디언트(#0D00FF → #FFBEBF) + halo 가 모두 포함되어 있어,
 * 수동 SVG 합성(그라디언트 + feGaussianBlur + grain 오버레이)때 생기던 대비 튐이 없다.
 *
 * PNG 원본: 489×489 (RGBA).
 *   원 지름 = 289, halo padding = 100px each side (Figma 스펙과 동일 비율).
 *
 * 호출 쪽 `size` 는 "원의 지름"을 의미 (기존 좌표 체계 유지). 따라서 PNG 를
 * size × (489/289) ≈ 1.692 배 크기로 그리고, halo 만큼 음수 offset 으로 센터링한다.
 * 부모 컨테이너는 size×size 로 유지되어 배치 좌표(top/left)가 변하지 않는다.
 *
 * - reversed: 좌우 반전 (scaleX: -1)
 * - rotate:   z축 회전 (deg)
 *
 * gradientId / grainIntensity 는 과거 SVG 버전 호환용으로만 남겨두고 무시한다.
 */
import React from 'react';
import { View, Image } from 'react-native';

// Figma 에서 export 된 공용 blob PNG (489×489, 원 지름 289 + halo 100×2).
const VECTOR_PNG = require('../../../assets/images/VectorCircle.png');

const PNG_FULL = 489;
const PNG_CIRCLE = 289;
const IMG_SCALE = PNG_FULL / PNG_CIRCLE; // ≈ 1.692
const HALO_RATIO = (IMG_SCALE - 1) / 2; // ≈ 0.346 — 각 방향 halo 크기 (size 대비)

export type GrainIntensity = 'off' | 'soft' | 'strong';

export interface GradientBlobProps {
  size: number;
  /** @deprecated PNG 전환 후 사용 안 함. 호환 유지용. */
  gradientId?: string;
  reversed?: boolean;
  rotate?: number;
  /** @deprecated PNG 전환 후 사용 안 함. 호환 유지용. */
  grainIntensity?: GrainIntensity;
}

export function GradientBlob({ size, reversed, rotate }: GradientBlobProps) {
  const imgSize = size * IMG_SCALE;
  const offset = -size * HALO_RATIO;

  const transforms: Array<{ rotate: string } | { scaleX: number }> = [];
  if (rotate) transforms.push({ rotate: `${rotate}deg` });
  if (reversed) transforms.push({ scaleX: -1 });

  return (
    <View style={{ width: size, height: size, overflow: 'visible', transform: transforms }}>
      <Image
        source={VECTOR_PNG}
        style={{
          position: 'absolute',
          left: offset,
          top: offset,
          width: imgSize,
          height: imgSize,
        }}
      />
    </View>
  );
}
