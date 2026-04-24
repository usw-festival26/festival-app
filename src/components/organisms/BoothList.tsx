/**
 * BoothList - 부스 카드 목록
 */
import React from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import type { Booth } from '../../types/booth';
import { InfoCard } from '@molecules/InfoCard';
import { EmptyState } from '@molecules/EmptyState';

/** 카테고리 한글 매핑 */
const CATEGORY_LABEL: Record<string, string> = {
  food: '음식',
  drink: '음료',
  game: '게임',
  experience: '체험',
  merchandise: '굿즈',
  other: '기타',
};

export interface BoothListProps {
  booths: Booth[];
  onPressBooth?: (booth: Booth) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function BoothList({ booths, onPressBooth, isLoading, error }: BoothListProps) {
  if (isLoading) {
    return (
      <View style={{ paddingVertical: 48, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#02015B" />
      </View>
    );
  }

  if (error) {
    return (
      <EmptyState
        message={`부스를 불러오지 못했습니다.\n${error}`}
        iconName="alert-circle-outline"
      />
    );
  }

  if (booths.length === 0) {
    return <EmptyState message="등록된 부스가 없습니다." iconName="storefront-outline" />;
  }

  return (
    <FlatList
      data={booths}
      keyExtractor={(item) => item.id}
      contentContainerClassName="p-4 gap-3"
      renderItem={({ item }) => (
        <InfoCard
          title={item.name}
          subtitle={item.organizer}
          description={item.description}
          badgeText={CATEGORY_LABEL[item.category] ?? item.category}
          badgeVariant="default"
          onPress={() => onPressBooth?.(item)}
        />
      )}
    />
  );
}
