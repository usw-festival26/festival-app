/**
 * ListItem - 범용 목록 행 위젯
 *
 * @example
 * <ListItem
 *   title="에어팟 프로"
 *   subtitle="메인 무대 앞"
 *   trailingText="발견"
 *   showChevron
 *   onPress={() => router.push(`/lost-found/${id}`)}
 * />
 */
import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../atoms/AppText';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  /** 우측 텍스트 (예: 가격 "₩1,500" 또는 시간 "17:00") */
  trailingText?: string;
  /** Ionicons 아이콘 이름 */
  iconName?: keyof typeof Ionicons.glyphMap;
  /** 우측 화살표 표시 (네비게이션용) */
  showChevron?: boolean;
  onPress?: () => void;
  className?: string;
}

export function ListItem({
  title,
  subtitle,
  trailingText,
  iconName,
  showChevron = false,
  onPress,
  className = '',
}: ListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 py-3 ${className}`}
    >
      {iconName && (
        <View className="mr-3">
          <Ionicons name={iconName} size={22} color="#94A3B8" />
        </View>
      )}
      <View className="flex-1">
        <AppText variant="body">{title}</AppText>
        {subtitle && <AppText variant="caption">{subtitle}</AppText>}
      </View>
      {trailingText && (
        <AppText variant="caption" className="ml-2">
          {trailingText}
        </AppText>
      )}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" className="ml-1" />
      )}
    </Pressable>
  );
}
