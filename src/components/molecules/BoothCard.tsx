/**
 * BoothCard - 2열 그리드용 부스 카드
 *
 * Figma 82:62 부스 카드: 이미지 + Title + Time + About
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface BoothCardProps {
  title: string;
  time?: string;
  about?: string;
  onPress?: () => void;
}

export function BoothCard({ title, time, about, onPress }: BoothCardProps) {
  return (
    <Pressable onPress={onPress} className="flex-1 mx-1 mb-4 bg-festival-card rounded-xl shadow-sm p-3 active:opacity-70">
      <AppText variant="body" className="font-semibold mb-1">
        {title}
      </AppText>
      <View className="bg-festival-primary rounded-[15px] h-[109px] mb-1" />
      {time && (
        <AppText variant="caption">{time}</AppText>
      )}
      {about && (
        <AppText variant="caption" numberOfLines={2}>{about}</AppText>
      )}
    </Pressable>
  );
}
