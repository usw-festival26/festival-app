/**
 * 공지사항 목록 화면 - Figma 920:4490
 *
 * BackdropScreenTemplate로 래핑. pill 탭은 expand 전용.
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { AnnouncementList } from '../../../src/components/organisms/AnnouncementList';
import { useAnnouncements } from '../../../src/hooks/useAnnouncements';

export default function AnnouncementsListScreen() {
  const { announcements, isLoading, error } = useAnnouncements();

  return (
    <BackdropScreenTemplate title="공지" backdropVariant="announcement">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <AnnouncementList
          announcements={announcements}
          isLoading={isLoading}
          error={error}
        />
      </ScrollView>
    </BackdropScreenTemplate>
  );
}
