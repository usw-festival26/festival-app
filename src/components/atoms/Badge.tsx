/**
 * Badge - 상태/카테고리 라벨
 *
 * @example
 * <Badge text="LIVE" variant="danger" />
 * <Badge text="Food" variant="success" />
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-gray-100',
  success: 'bg-green-100',
  warning: 'bg-yellow-100',
  danger: 'bg-red-100',
};

const TEXT_CLASSES: Record<BadgeVariant, string> = {
  default: 'text-gray-700',
  success: 'text-green-700',
  warning: 'text-yellow-700',
  danger: 'text-red-700',
};

export function Badge({ text, variant = 'default', className = '' }: BadgeProps) {
  return (
    <View className={`self-start rounded-full px-2.5 py-0.5 ${VARIANT_CLASSES[variant]} ${className}`}>
      <AppText className={`text-xs font-semibold ${TEXT_CLASSES[variant]}`}>{text}</AppText>
    </View>
  );
}
