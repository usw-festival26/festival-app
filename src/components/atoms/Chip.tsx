/**
 * Chip - 선택 가능한 필터 칩
 *
 * Figma 와이어프레임: 선택됨=회색 채움, 미선택=검정 테두리
 */
import React from 'react';
import { Pressable } from 'react-native';
import { AppText } from './AppText';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** 'filter' = 작은 필터칩(50x29), 'dayPill' = 날짜 선택(95x30) */
  variant?: 'filter' | 'dayPill';
  className?: string;
}

export function Chip({ label, selected = false, onPress, variant = 'filter', className = '' }: ChipProps) {
  const isDay = variant === 'dayPill';

  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center active:opacity-80 ${
        isDay ? 'w-[95px] h-[30px] rounded-pill' : 'min-w-[50px] h-[29px] rounded-chip px-3'
      } ${
        selected
          ? 'bg-festival-primary'
          : 'border border-black bg-transparent'
      } ${className}`}
    >
      <AppText
        className={`text-center text-black ${
          isDay ? 'text-xs' : 'text-xs font-medium'
        }`}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
