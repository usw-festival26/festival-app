/**
 * EmptyState - 데이터 없을 때 표시하는 플레이스홀더
 *
 * @example
 * <EmptyState message="등록된 분실물이 없습니다." />
 */
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../atoms/AppText';

export interface EmptyStateProps {
  message?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  className?: string;
}

export function EmptyState({
  message = '데이터가 없습니다.',
  iconName = 'file-tray-outline',
  className = '',
}: EmptyStateProps) {
  return (
    <View className={`items-center justify-center py-16 ${className}`}>
      <Ionicons name={iconName} size={48} color="#CBD5E1" />
      <AppText variant="caption" className="mt-4">
        {message}
      </AppText>
    </View>
  );
}
