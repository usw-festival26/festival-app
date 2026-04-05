/**
 * AnnouncementCard - 공지 카드
 *
 * 깔끔한 인용문 스타일 카드
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
    <Pressable onPress={onPress} className="items-center justify-center py-8 px-6 active:opacity-70">
      {title && (
        <AppText className="text-[15px] font-semibold text-black text-center mb-3">
          {title}
        </AppText>
      )}
      <AppText className="text-sm text-black text-center leading-6 mb-6">
        {`"${content}"`}
      </AppText>
      <View className="w-[36px] h-[36px] rounded-full bg-black items-center justify-center mb-2">
        <Ionicons name="person" size={20} color="#FFFFFF" />
      </View>
      {author && (
        <AppText className="text-xs text-black text-center">{author}</AppText>
      )}
      {date && (
        <AppText className="text-xs text-festival-muted text-center mt-0.5">{date}</AppText>
      )}
    </Pressable>
  );
}
