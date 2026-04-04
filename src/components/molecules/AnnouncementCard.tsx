/**
 * AnnouncementCard - 공지 카드
 *
 * Figma 82:72: 제목 + 인용문 + 아이콘 + 작성자
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../atoms/AppText';

export interface AnnouncementCardProps {
  title?: string;
  content: string;
  author?: string;
  date?: string;
  onPress?: () => void;
}

export function AnnouncementCard({ title, content, author, date, onPress }: AnnouncementCardProps) {
  return (
    <Pressable onPress={onPress} className="items-center justify-center py-10 px-6 active:opacity-70">
      {title && (
        <AppText variant="h3" className="font-bold text-center mb-4">
          {title}
        </AppText>
      )}
      <AppText variant="body" className="text-center leading-6 mb-8">
        {`"${content}"`}
      </AppText>
      <View className="w-[40px] h-[40px] rounded-full bg-festival-accent items-center justify-center mb-3">
        <Ionicons name="person" size={24} color="#FFFFFF" />
      </View>
      {author && (
        <AppText variant="caption" className="text-center text-festival-text">
          {author}
        </AppText>
      )}
      {date && (
        <AppText variant="caption" className="text-center mt-1">
          {date}
        </AppText>
      )}
    </Pressable>
  );
}
