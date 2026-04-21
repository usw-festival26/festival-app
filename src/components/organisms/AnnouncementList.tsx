/**
 * AnnouncementList - 공지 pill + FAQ (Figma 920:4490)
 *
 * Noffication 배지 → pill 리스트 (핀 공지는 상단) → FAQ 배지 → 말풍선 2개(좌/우 교차)
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import type { Announcement } from '../../types/announcement';
import { NotificationBadge } from '@atoms/NotificationBadge';
import { NotificationPill } from '@molecules/NotificationPill';
import { FaqBubble } from '@molecules/FaqBubble';
import { EmptyState } from '@molecules/EmptyState';

export interface AnnouncementListProps {
  announcements: Announcement[];
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  { q: '축제는 언제 열리나요?', a: '5월 20일(수)~21일(목) 이틀간 진행됩니다.' },
  { q: '주차는 가능한가요?', a: '교내 주차 제한, 대중교통·셔틀버스 이용을 권장합니다.' },
];

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (announcements.length === 0) {
    return <EmptyState message="등록된 공지가 없습니다." iconName="megaphone-outline" />;
  }

  const sorted = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <View style={{ paddingVertical: 24, paddingHorizontal: 16, gap: 18 }}>
      <View style={{ alignItems: 'center' }}>
        <NotificationBadge label="Noffication" variant="notification" />
      </View>

      <View style={{ gap: 10 }}>
        {sorted.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <NotificationPill
              key={item.id}
              title={item.title}
              pinned={item.isPinned}
              expanded={isExpanded}
              content={isExpanded ? item.content : undefined}
              onPress={() => setExpandedId(isExpanded ? null : item.id)}
            />
          );
        })}
      </View>

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
