/**
 * RobotoBlackText - Black(900) 헤딩 텍스트
 *
 * Figma 디자인은 영문 "메인 로고" 는 Roboto Black, 한글 헤더는 Noto Sans KR
 * Bold 로 분기 (font-['Roboto:Black','Noto_Sans_KR:Bold']). 이전 구현은 fontFamily
 * 를 'Roboto' 만 지정해 한글이 시스템 폴백으로 표시돼 깨져 보이는 문제가 있었다.
 *
 * 해결:
 *  - web: fontFamily chain 으로 영문은 Roboto, 한글은 Pretendard Variable 자동 폴백.
 *  - native: 한·영 모두 지원하는 Pretendard-Black 으로 통일 (RN 은 chain 미지원).
 *    영문이 Roboto 가 아닌 Pretendard 라 시각이 살짝 다르지만 한글 깨짐은 사라짐.
 */
import React from 'react';
import { Text, StyleSheet, Platform, type TextStyle, type StyleProp } from 'react-native';

export interface RobotoBlackTextProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  lineHeight?: number;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export function RobotoBlackText({
  children,
  size = 20,
  color = '#000000',
  lineHeight,
  style,
  numberOfLines,
  ellipsizeMode,
}: RobotoBlackTextProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[
        styles.base,
        { fontSize: size, color, lineHeight: lineHeight ?? size * 1.15 },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: Platform.select({
      web: '"Roboto", "Pretendard Variable", sans-serif',
      default: 'Pretendard-Black',
    }),
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
});
