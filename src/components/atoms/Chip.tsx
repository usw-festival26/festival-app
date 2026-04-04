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
  className?: string;
}

export function Chip({ label, selected = false, onPress, className = '' }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-1.5 active:opacity-80 ${
        selected
          ? 'bg-festival-accent'
          : 'border border-festival-secondary bg-transparent'
      } ${className}`}
    >
      <AppText
        variant="body"
        className={`font-semibold text-center ${
          selected ? 'text-white' : 'text-festival-muted'
        }`}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
