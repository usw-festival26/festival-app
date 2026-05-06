/**
 * AnnouncementList - 공지 pill + FAQ (Figma 920:4490)
 *
 * Notification 배지 → pill 리스트 (핀 공지는 상단) → FAQ 배지 → 말풍선 2개(좌/우 교차)
 */
import { NetworkErrorState } from '@atoms/NetworkErrorState';
import { NotificationBadge } from '@atoms/NotificationBadge';
import { Colors } from '@constants/colors';
import { CONTACT_INFO } from '@data/contact';
import { useAnnouncementById } from '@hooks/useAnnouncements';
import { EmptyState } from '@molecules/EmptyState';
import { FaqBubble } from '@molecules/FaqBubble';
import { NotificationPill } from '@molecules/NotificationPill';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Text, View } from 'react-native';
import type { Announcement } from '../../types/announcement';

export interface AnnouncementListProps {
  announcements: Announcement[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const FAQ_ITEMS: { q: string; a: React.ReactNode }[] = [
  { q: '축제 운영 기간은 언제인가요?', a: '5/14(목)~5/15(금)' },
  { q: '축제 운영 시간은 어떻게 되나요?', a: '12:00~02:00' },
  { q: '주류 구매 시 신분 확인이 필요한가요?', a: '신분증, 운전 면허증' },
  {
    q: '부스 및 푸드트럭 운영 시간은 어떻게 되나요? (변동될 수 있음)',
    a: '부스: 16:00~02:00\n푸드트럭: 14:00~23:00',
  },
  {
    q: '결제는 어떤 방식으로 가능한가요? (현금, 카드 등)',
    a: '부스: 계좌이체, 현금\n푸드트럭: 계좌이체, 현금, 카드',
  },
  {
    q: '분실물은 언제 업로드되나요?',
    a: '테이블 이용하셨던 부스 학생회에게 문의주세요!',
  },
  {
    q: '분실물 수령 방법은 어떻게 되나요?',
    a: '학과 학부 학생회 부스에 방문해 주세요.\n총학생회 부스에 방문해 주세요.\n당일 분실물 카카오톡 공지 확인해 주세요.',
  },
  {
    q: '문의는 어디로 하면 되나요?',
    a: (
      <>
        <Text
          onPress={() => {
            if (CONTACT_INFO.kakaoChannelUrl) {
              Linking.openURL(CONTACT_INFO.kakaoChannelUrl).catch(() => {});
            }
          }}
          accessibilityRole="link"
          accessibilityLabel="카카오톡 문의 채널 열기"
          style={{ color: Colors.festival.primary, textDecorationLine: 'underline' }}
        >
          [카카오톡 채널]
        </Text>
        을 통해 문의 바랍니다.
      </>
    ),
  },
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
