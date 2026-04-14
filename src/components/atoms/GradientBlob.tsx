/**
 * GradientBlob - Splash/Home 장식용 pink→navy 그라디언트 원
 */
import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

export interface GradientBlobProps {
  size: number;
  gradientId: string;
  reversed?: boolean;
}

export function GradientBlob({ size, gradientId, reversed }: GradientBlobProps) {
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
