/**
 * Chip - 선택 가능한 필터 칩 (Figma 920:3931)
 *
 * filter: 50×29, active=네이비 채움 + 흰 글자, inactive=흰 배경 + 검정 보더 + 검정 글자
 * dayPill: 95×30, 날짜 선택용
 * 라벨은 Pretendard SemiBold 15
 */
import React from 'react';
import { Pressable, Text } from 'react-native';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'filter' | 'dayPill';
  className?: string;
}

export function Chip({ label, selected = false, onPress, variant = 'filter', className = '' }: ChipProps) {
  const isDay = variant === 'dayPill';
  const activeBg = '#010070';

  return (
    <Pressable
      onPress={onPress}
      style={{
        minWidth: isDay ? 95 : 50,
        height: isDay ? 30 : 29,
        borderRadius: isDay ? 9999 : 14.5,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selected ? activeBg : '#FFFFFF',
        borderWidth: selected ? 0 : 1,
        borderColor: '#000000',
      }}
      className={`active:opacity-80 ${className}`}
    >
      <Text
        style={{
          fontFamily: 'Pretendard-SemiBold',
          fontSize: 15,
          color: selected ? '#FFFFFF' : '#000000',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
