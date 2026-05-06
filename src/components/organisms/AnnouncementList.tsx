/**
 * AnnouncementList - 공지 pill + FAQ (Figma 920:4490)
 *
 * Notification 배지 → pill 리스트 (핀 공지는 상단) → FAQ 배지 → 말풍선 2개(좌/우 교차)
 */
import { NetworkErrorState } from '@atoms/NetworkErrorState';
import { NotificationBadge } from '@atoms/NotificationBadge';
import { Colors } from '@constants/colors';
import { useAnnouncementById } from '@hooks/useAnnouncements';
import { EmptyState } from '@molecules/EmptyState';
import { FaqBubble } from '@molecules/FaqBubble';
import { NotificationPill } from '@molecules/NotificationPill';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { Announcement } from '../../types/announcement';

export interface AnnouncementListProps {
  announcements: Announcement[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  { q: '축제는 언제 열리나요?', a: '5월 14일(목)~15일(금) 양일간 진행됩니다.' },
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

  // list 응답에 content 가 있으면 그대로 사용해 detail 페치를 건너뛴다(네트워크 1회 절약).
  // 없으면 expand 한 항목만 detail 을 lazy-fetch.
  const expandedItem = useMemo(
    () => (expandedId ? sorted.find((i) => i.id === expandedId) ?? null : null),
    [sorted, expandedId],
  );
  const needsDetailFetch = !!expandedItem && expandedItem.content === undefined;
  const expandedDetail = useAnnouncementById(needsDetailFetch ? (expandedId ?? '') : '');

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
            // expandedDetail 은 현재 expandedId 한 건에 대해서만 의미가 있으므로
            // 펼친 항목에서만 본문을 계산한다. list 항목에 content 가 이미 있으면
            // (하드코딩 fallback) 그대로 쓰고, 없으면 detail fetch 결과를 사용한다.
            const detailContent = isExpanded
              ? (item.content ?? expandedDetail.announcement?.content ?? '')
              : undefined;
            return (
              <NotificationPill
                key={item.id}
                title={item.title}
                pinned={item.isPinned}
                expanded={isExpanded}
                content={detailContent}
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
