/**
 * NotificationBadge - 공지/FAQ 헤더 배지 (Figma 920:4490)
 *
 * 225×48 비대칭 radius(bl:5, 나머지:24) + -11.16° 그라디언트
 * rgba(13,0,255,0.4) → rgba(255,190,191,0.4), 흰색 50% 보더.
 * variant="faq"는 상하 반전(br:5).
 */
import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export type NotificationBadgeVariant = 'notification' | 'faq';

export interface NotificationBadgeProps {
  label: string;
  variant?: NotificationBadgeVariant;
}

const WIDTH = 225;
const HEIGHT = 48;

export function NotificationBadge({ label, variant = 'notification' }: NotificationBadgeProps) {
  const isFaq = variant === 'faq';
  const radii = isFaq
    ? { tl: 24, tr: 24, bl: 24, br: 5 }
    : { tl: 24, tr: 24, bl: 5, br: 24 };

  const gradId = `notif-badge-${variant}`;

  return (
    <View
      style={{
        width: WIDTH,
        height: HEIGHT,
        borderTopLeftRadius: radii.tl,
        borderTopRightRadius: radii.tr,
        borderBottomLeftRadius: radii.bl,
        borderBottomRightRadius: radii.br,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id={gradId} x1="0.97" y1="0.60" x2="0.03" y2="0.40">
            <Stop offset="0.135" stopColor="#0D00FF" stopOpacity="0.4" />
            <Stop offset="0.846" stopColor="#FFBEBF" stopOpacity="0.4" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${gradId})`} />
      </Svg>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-Black' }),
    fontWeight: '900',
    fontSize: 22,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
