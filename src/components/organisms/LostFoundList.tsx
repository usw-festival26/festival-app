/**
 * LostFoundList - 분실물 카드 리스트
 *
 * 각 아이템을 카드 형태로 세로 나열
 */
import React from 'react';
import { FlatList, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { LostFoundItem } from '../../types/lostFound';
import { AppText } from '../atoms/AppText';
import { Badge, type BadgeVariant } from '../atoms/Badge';
import { EmptyState } from '../molecules/EmptyState';
import { formatDate } from '../../utils/date';

const STATUS_LABEL: Record<string, string> = {
  lost: '분실',
  found: '발견',
  claimed: '수령완료',
};

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  lost: 'danger',
  found: 'warning',
  claimed: 'success',
};

export interface LostFoundListProps {
  items: LostFoundItem[];
  onPressItem?: (item: LostFoundItem) => void;
}

export function LostFoundList({ items, onPressItem }: LostFoundListProps) {
  if (items.length === 0) {
    return <EmptyState message="등록된 분실물이 없습니다." iconName="search-outline" />;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerClassName="px-4 py-4 gap-3"
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onPressItem?.(item)}
          className="bg-festival-card rounded-xl p-4 shadow-sm active:opacity-70"
        >
          <View className="flex-row items-center justify-between mb-2">
            <AppText variant="body" className="font-bold flex-1 mr-2">
              {item.title}
            </AppText>
            <Badge
              text={STATUS_LABEL[item.status] ?? item.status}
              variant={STATUS_VARIANT[item.status] ?? 'default'}
            />
          </View>
          <View className="flex-row items-center mb-1">
            <Ionicons name="location-outline" size={14} color="#7D7D7D" />
            <AppText variant="caption" className="ml-1">{item.location}</AppText>
          </View>
          <AppText variant="caption" numberOfLines={2}>{item.description}</AppText>
          <AppText variant="caption" className="mt-2 text-festival-secondary">
            {formatDate(item.reportedAt)}
          </AppText>
        </Pressable>
      )}
    />
  );
}
