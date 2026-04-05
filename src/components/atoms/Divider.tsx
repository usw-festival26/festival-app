/**
 * Divider - 수평 구분선
 */
import React from 'react';
import { View } from 'react-native';

export interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return <View className={`h-px bg-festival-primary ${className}`} />;
}
