/**
 * GradientBlob - 장식용 보케 그라디언트 원 (Figma 충실 재현 + 웹 그레인)
 *
 * Figma 스펙 (Ellipse 68/69/70 공통):
 *   linearGradient (SE→NW) #0D00FF → #FFBEBF, feGaussianBlur stdDeviation=50.
 *   viewBox = size + 200 (100px 패딩으로 블러 halo 수용).
 *   gradient vector: start (+0.68r, +0.77r) / end (-0.68r, -0.70r) — 3개 blob 모두 동일 비율.
 *
 * 외부 컨테이너는 size x size 로 유지해 기존 배치 좌표와 호환.
 * 실제 SVG 는 size+200 로 그려 블러 halo 가 컨테이너 밖으로 100px 오버플로 — RN `overflow:'visible'` 기본값에 의존.
 *
 * 웹: 추가로 feTurbulence 기반 grain 오버레이를 circle 영역 안에만 얹는다.
 * 네이티브: feGaussianBlur 가 네이티브에서도 렌더된다 (react-native-svg 15.x 지원).
 */
import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle, Filter, FeGaussianBlur } from 'react-native-svg';

export type GrainIntensity = 'off' | 'soft' | 'strong';

export interface GradientBlobProps {
  size: number;
  gradientId: string;
  reversed?: boolean;
  grainIntensity?: GrainIntensity;
}

const BLUR_PADDING = 100;
const BLUR_STD_DEVIATION = 50;

function buildGrainDataUri(baseFrequency: number, opacity: number, size: number): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="2" stitchTiles="stitch"/>` +
    `<feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${opacity} 0"/></filter>` +
    `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white" filter="url(#n)"/>` +
    `</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export function GradientBlob({ size, gradientId, reversed, grainIntensity = 'soft' }: GradientBlobProps) {
  const outer = size + BLUR_PADDING * 2;
  const center = outer / 2;
  const r = size / 2;

  // Figma 공통 벡터: SE(+0.68r, +0.77r) → NW(-0.68r, -0.70r)
  const sx = center + 0.68 * r;
  const sy = center + 0.77 * r;
  const ex = center - 0.68 * r;
  const ey = center - 0.70 * r;
  // start 에 #0D00FF(blue), end 에 #FFBEBF(pink) — reversed 는 스톱 스왑.
  const [startColor, endColor] = reversed ? ['#FFBEBF', '#0D00FF'] : ['#0D00FF', '#FFBEBF'];

  const filterId = `${gradientId}-blur`;

  const showGrain = Platform.OS === 'web' && grainIntensity !== 'off';
  const grainFreq = grainIntensity === 'strong' ? 1.6 : 1.0;
  const grainOpacity = grainIntensity === 'strong' ? 0.3 : 0.18;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: -BLUR_PADDING,
          top: -BLUR_PADDING,
          width: outer,
          height: outer,
        }}
      >
        <Svg width={outer} height={outer} viewBox={`0 0 ${outer} ${outer}`}>
          <Defs>
            <LinearGradient
              id={gradientId}
              x1={sx}
              y1={sy}
              x2={ex}
              y2={ey}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={startColor} />
              <Stop offset="1" stopColor={endColor} />
            </LinearGradient>
            <Filter id={filterId} x="0" y="0" width={outer} height={outer} filterUnits="userSpaceOnUse">
              <FeGaussianBlur stdDeviation={BLUR_STD_DEVIATION} />
            </Filter>
          </Defs>
          <Circle
            cx={center}
            cy={center}
            r={r}
            fill={`url(#${gradientId})`}
            filter={`url(#${filterId})`}
          />
        </Svg>
      </View>
      {showGrain ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundImage: buildGrainDataUri(grainFreq, grainOpacity, size),
              backgroundSize: `${size}px ${size}px`,
              backgroundRepeat: 'no-repeat',
              mixBlendMode: 'overlay',
              borderRadius: size / 2,
              overflow: 'hidden',
              opacity: 0.6,
            } as any,
          ]}
        />
      ) : null}
    </View>
  );
}
