/**
 * AnnouncementList - 공지사항 카드 스크롤
 *
 * Figma 82:72: 세로 스크롤 인용문 카드 목록
 */
import React from 'react';
import { FlatList, View } from 'react-native';
import type { Announcement } from '../../types/announcement';
import { AnnouncementCard } from '../molecules/AnnouncementCard';
import { EmptyState } from '../molecules/EmptyState';
import { formatDate } from '../../utils/date';

export interface AnnouncementListProps {
  announcements: Announcement[];
  onPressAnnouncement?: (item: Announcement) => void;
}

export function AnnouncementList({ announcements, onPressAnnouncement }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return <EmptyState message="등록된 공지가 없습니다." iconName="megaphone-outline" />;
  }

  return (
    <FlatList
      data={announcements}
      keyExtractor={(item) => item.id}
      contentContainerClassName="bg-[#f2f2f2]"
      renderItem={({ item }) => (
        <AnnouncementCard
          title={item.title}
          content={item.content}
          author={item.author}
          date={formatDate(item.publishedAt)}
          onPress={() => onPressAnnouncement?.(item)}
        />
      )}
      ItemSeparatorComponent={() => <View className="h-[1px] bg-festival-primary mx-6" />}
    />
  );
}
