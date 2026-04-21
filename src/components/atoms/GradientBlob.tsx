/**
 * GradientBlob - 장식용 보케 그라디언트 원 (+ 웹 그레인 오버레이)
 *
 * RadialGradient로 중심이 밝고 가장자리가 투명에 가깝게 감쇠해 "광원" 느낌을 만든다.
 * 웹에서는 feTurbulence SVG 데이터 URI를 배경 이미지로 깔아 필름 그레인 질감을 더한다.
 * (네이티브는 SVG 필터 지원이 제한적이라 그레인을 스킵 — 모바일 웹이 주 타겟)
 */
import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

export type GrainIntensity = 'off' | 'soft' | 'strong';

export interface GradientBlobProps {
  size: number;
  gradientId: string;
  reversed?: boolean;
  grainIntensity?: GrainIntensity;
}

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
  const [centerColor, edgeColor] = reversed ? ['#0D00FF', '#FFBEBF'] : ['#FFBEBF', '#0D00FF'];

  const showGrain = Platform.OS === 'web' && grainIntensity !== 'off';
  const grainFreq = grainIntensity === 'strong' ? 1.6 : 1.0;
  const grainOpacity = grainIntensity === 'strong' ? 0.3 : 0.18;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* 중심(0.4, 0.38)에서 살짝 어긋난 포커스로 "빛 맞는 쪽" 연출 */}
          <RadialGradient id={gradientId} cx="0.4" cy="0.38" rx="0.55" ry="0.55" fx="0.4" fy="0.38">
            <Stop offset="0%" stopColor={centerColor} stopOpacity={0.95} />
            <Stop offset="55%" stopColor={centerColor} stopOpacity={0.5} />
            <Stop offset="100%" stopColor={edgeColor} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${gradientId})`} />
      </Svg>
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
            } as any,
          ]}
        />
      ) : null}
    </View>
  );
}
