/**
 * GradientPill - 그라디언트 알약 (굿즈샵 "Goods List" 라벨)
 *
 * Figma 2052:767 — 225×48, 좌→우 그라디언트(festival.primary 40% → festival.pink 40%)
 * + 흰색 50% 보더. 하단-우 코너가 약간 작은 비대칭 라운드(rounded-tr/tl/bl 24px,
 * rounded-br 5px) 로 살짝 비스듬한 인상을 준다.
 *
 * 그라디언트는 react-native-svg LinearGradient 로 그린다 (expo-linear-gradient 미설치).
 * 알약 전체 라운드는 react-native View 의 borderRadius 로 처리하고 svg 는 그 안쪽을
 * overflow:hidden 으로 클립.
 */
import React from 'react';
import { View, Text, type TextStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export interface GradientPillProps {
  label: string;
  width?: number;
  height?: number;
  /** Pretendard Black 등 호출자 별 폰트 오버라이드. */
  textStyle?: TextStyle;
}

const DEFAULT_W = 225;
const DEFAULT_H = 48;

export function GradientPill({
  label,
  width = DEFAULT_W,
  height = DEFAULT_H,
  textStyle,
}: GradientPillProps) {
  return (
    <View
      style={{
        width,
        height,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        overflow: 'hidden',
      }}
    >
      <Svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Defs>
          <LinearGradient
            id="goodsPillGrad"
            x1="0"
            y1={height * 0.6}
            x2={width}
            y2={height * 0.4}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#A5FFF3" stopOpacity={0.4} />
            <Stop offset="1" stopColor="#0068FF" stopOpacity={0.4} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#goodsPillGrad)" />
      </Svg>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={[
            {
              fontFamily: 'Pretendard-Black',
              fontSize: 22,
              color: '#FFFFFF',
              textAlign: 'center',
              includeFontPadding: false,
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}
