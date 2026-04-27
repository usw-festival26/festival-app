/**
 * BoothCard - 2열 그리드용 부스 카드
 *
 * Figma 166:93: Title → 이미지 → Time → About
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
    <Pressable onPress={onPress} className="flex-1 mx-2 mb-5 active:opacity-70">
      <AppText className="text-[15px] font-semibold text-black mb-1">{title}</AppText>
      <View className="bg-festival-lavender rounded-card h-[109px] mb-1" />
      {time && (
        <AppText className="text-xs text-black">{time}</AppText>
      )}
      {about && (
        <AppText className="text-xs text-black" numberOfLines={1}>{about}</AppText>
      )}
    </Pressable>
  );
}
