/**
 * 공지사항 목록 화면 - Figma 82:72
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { ListScreenTemplate } from '../../../src/components/templates/ListScreenTemplate';
import { AnnouncementList } from '../../../src/components/organisms/AnnouncementList';
import { useAnnouncements } from '../../../src/hooks/useAnnouncements';

export default function AnnouncementsListScreen() {
  const router = useRouter();
  const { announcements } = useAnnouncements();

  return (
    <ListScreenTemplate title="공지">
      <AnnouncementList
        announcements={announcements}
        onPressAnnouncement={(item) => router.push(`/(tabs)/announcements/${item.id}`)}
      />
    </ListScreenTemplate>
  );
}
