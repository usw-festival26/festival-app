/**
 * AnnouncementList - 공지 pill + FAQ (Figma 920:4490)
 *
 * Notification 배지 → pill 리스트 (핀 공지는 상단) → FAQ 배지 → 말풍선 2개(좌/우 교차)
 */
import React, { useMemo, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import type { Announcement } from '../../types/announcement';
import { NotificationBadge } from '@atoms/NotificationBadge';
import { NotificationPill } from '@molecules/NotificationPill';
import { FaqBubble } from '@molecules/FaqBubble';
import { EmptyState } from '@molecules/EmptyState';
import { NetworkErrorState } from '@atoms/NetworkErrorState';
import { Colors } from '@constants/colors';
import { useAnnouncementById } from '@hooks/useAnnouncements';

export interface AnnouncementListProps {
  announcements: Announcement[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  { q: '축제는 언제 열리나요?', a: '5월 20일(수)~21일(목) 이틀간 진행됩니다.' },
  { q: '주차는 가능한가요?', a: '교내 주차 제한, 대중교통·셔틀버스 이용을 권장합니다.' },
];

export function AnnouncementList({ announcements, isLoading, error, onRetry }: AnnouncementListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...announcements].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }),
    [announcements],
  );

  // 백엔드 list 응답에는 content 가 없고 detail 응답에서만 채워진다(api/types.ts).
  // expand 한 항목만 detail 을 lazy-fetch 해서 본문을 띄운다.
  const expandedDetail = useAnnouncementById(expandedId ?? '');

  return (
    <View style={{ paddingVertical: 24, paddingHorizontal: 16, gap: 18 }}>
      <View style={{ alignItems: 'center' }}>
        <NotificationBadge label="Notification" variant="notification" />
      </View>

      {isLoading ? (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color={Colors.festival.primaryDark} />
        </View>
      ) : error ? (
        <NetworkErrorState onRetry={onRetry} />
      ) : sorted.length === 0 ? (
        <EmptyState message="등록된 공지가 없습니다." iconName="megaphone-outline" />
      ) : (
        <View style={{ gap: 4 }}>
          {sorted.map((item) => {
            const isExpanded = expandedId === item.id;
            // list 항목에 content 가 이미 있으면(하드코딩 fallback) 그대로 쓰고,
            // 없으면 detail fetch 결과를 사용. fetch 중에는 빈 문자열로 기다림.
            const detailContent =
              item.content ?? expandedDetail.announcement?.content ?? '';
            return (
              <NotificationPill
                key={item.id}
                title={item.title}
                pinned={item.isPinned}
                expanded={isExpanded}
                content={isExpanded ? detailContent : undefined}
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
              />
            );
          })}
        </View>
      )}

      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <NotificationBadge label="FAQ" variant="faq" />
      </View>

      <View style={{ gap: 14, alignItems: 'center' }}>
        {FAQ_ITEMS.map((f, idx) => (
          <FaqBubble
            key={f.q}
            question={f.q}
            answer={f.a}
            tail={idx % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </View>
    </View>
  );
}
