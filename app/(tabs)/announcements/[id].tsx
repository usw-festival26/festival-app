/**
 * 공지사항 상세 화면
 */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScrollScreenTemplate } from '../../../src/components/templates/ScrollScreenTemplate';
import { AppText } from '../../../src/components/atoms/AppText';
import { Badge } from '../../../src/components/atoms/Badge';
import { EmptyState } from '../../../src/components/molecules/EmptyState';
import { AppButton } from '../../../src/components/atoms/AppButton';
import { useAnnouncementById } from '../../../src/hooks/useAnnouncements';
import { formatDate } from '../../../src/utils/date';
import type { BadgeVariant } from '../../../src/components/atoms/Badge';

const PRIORITY_LABEL: Record<string, string> = {
  urgent: '긴급',
  normal: '일반',
  low: '참고',
};

const PRIORITY_VARIANT: Record<string, BadgeVariant> = {
  urgent: 'danger',
  normal: 'default',
  low: 'default',
};

export default function AnnouncementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { announcement, isLoading, error } = useAnnouncementById(id ?? '');

  if (isLoading) {
    return (
      <ScrollScreenTemplate title="공지" leftAction="back">
        <View className="items-center py-16">
          <ActivityIndicator size="small" color="#02015B" />
        </View>
      </ScrollScreenTemplate>
    );
  }

  if (error) {
    return (
      <ScrollScreenTemplate title="공지" leftAction="back">
        <EmptyState
          message={`공지를 불러오지 못했습니다.\n${error}`}
          iconName="alert-circle-outline"
        />
        <View className="items-center mt-4">
          <AppButton onPress={() => router.back()}>돌아가기</AppButton>
        </View>
      </ScrollScreenTemplate>
    );
  }

  if (!announcement) {
    return (
      <ScrollScreenTemplate title="공지" leftAction="back">
        <EmptyState message="공지사항을 찾을 수 없습니다." iconName="megaphone-outline" />
        <View className="items-center mt-4">
          <AppButton onPress={() => router.back()}>돌아가기</AppButton>
        </View>
      </ScrollScreenTemplate>
    );
  }

  return (
    <ScrollScreenTemplate title="공지" leftAction="back">
      <View className="mx-4 mt-4 bg-festival-card rounded-card-lg p-6">
        {/* 우선순위 + 고정 */}
        <View className="flex-row items-center gap-2 mb-3">
          {announcement.isPinned && (
            <Badge text="고정" variant="warning" />
          )}
          <Badge
            text={PRIORITY_LABEL[announcement.priority] ?? announcement.priority}
            variant={PRIORITY_VARIANT[announcement.priority] ?? 'default'}
          />
        </View>

        {/* 제목 */}
        <AppText variant="h2" className="mb-4">
          {announcement.title}
        </AppText>

        {/* 메타 정보 */}
        <View className="flex-row items-center gap-3 mb-6">
          {announcement.author && (
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={14} color="#7D7D7D" />
              <AppText variant="caption" className="ml-1">{announcement.author}</AppText>
            </View>
          )}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#7D7D7D" />
            <AppText variant="caption" className="ml-1">
              {formatDate(announcement.publishedAt)}
            </AppText>
          </View>
        </View>

        {/* 구분선 */}
        <View className="h-px bg-gray-200 mb-6" />

        {/* 본문 */}
        <AppText variant="body" className="leading-6">
          {announcement.content}
        </AppText>
      </View>
    </ScrollScreenTemplate>
  );
}
