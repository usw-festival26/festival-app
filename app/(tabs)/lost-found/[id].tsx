/**
 * 분실물 상세 화면
 */
import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScrollScreenTemplate } from '../../../src/components/templates/ScrollScreenTemplate';
import { AppText } from '../../../src/components/atoms/AppText';
import { Badge } from '../../../src/components/atoms/Badge';
import { EmptyState } from '../../../src/components/molecules/EmptyState';
import { AppButton } from '../../../src/components/atoms/AppButton';
import { useLostFoundById } from '../../../src/hooks/useLostFound';
import { formatDate } from '../../../src/utils/date';
import type { BadgeVariant } from '../../../src/components/atoms/Badge';

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

const CATEGORY_LABEL: Record<string, string> = {
  electronics: '전자기기',
  clothing: '의류',
  accessories: '악세서리',
  bags: '가방',
  other: '기타',
};

export default function LostFoundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { item } = useLostFoundById(id ?? '');

  if (!item) {
    return (
      <ScrollScreenTemplate title="분실물">
        <EmptyState message="분실물을 찾을 수 없습니다." iconName="search-outline" />
        <View className="items-center mt-4">
          <AppButton onPress={() => router.back()}>돌아가기</AppButton>
        </View>
      </ScrollScreenTemplate>
    );
  }

  return (
    <ScrollScreenTemplate title="분실물">
      <View className="mx-4 mt-4 bg-festival-card rounded-xl p-6">
        {/* 상태 + 카테고리 */}
        <View className="flex-row items-center gap-2 mb-3">
          <Badge
            text={STATUS_LABEL[item.status] ?? item.status}
            variant={STATUS_VARIANT[item.status] ?? 'default'}
          />
          <Badge text={CATEGORY_LABEL[item.category] ?? item.category} />
        </View>

        {/* 제목 */}
        <AppText variant="h2" className="mb-4">
          {item.title}
        </AppText>

        {/* 메타 정보 */}
        <View className="gap-2 mb-6">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#7D7D7D" />
            <AppText variant="body" className="ml-2">{item.location}</AppText>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#7D7D7D" />
            <AppText variant="body" className="ml-2">
              {formatDate(item.reportedAt)}
            </AppText>
          </View>
        </View>

        {/* 구분선 */}
        <View className="h-px bg-gray-200 mb-6" />

        {/* 설명 */}
        <AppText variant="body" className="leading-6">
          {item.description}
        </AppText>
      </View>
    </ScrollScreenTemplate>
  );
}
