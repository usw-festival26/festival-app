/**
 * RobotoBlackText - Roboto Black(900) 전용 텍스트
 *
 * AppText는 default variant="body"가 text-base/text-festival-text를 주입해서
 * Roboto Black 같은 굵은 디자인 헤딩을 그릴 때 덮어씌워질 수 있음.
 * 이 atom은 RN <Text>를 직접 사용하고 Platform별로 font family를 분기해서
 * Figma 헤딩(20/32/48px Roboto Black) 렌더를 보장한다.
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
    fontFamily: Platform.select({ web: 'Roboto', default: 'Roboto_900Black' }),
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
});
