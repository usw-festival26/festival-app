/**
 * EventCard - 이벤트/행사 카드
 *
 * Figma 166:472: 회색 bg rounded-20, 제목+설명(왼), 이미지(오)
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface EventCardProps {
  title: string;
  description: string;
}

export function EventCard({ title, description }: EventCardProps) {
  return (
    <View className="bg-festival-lavender rounded-card-lg mx-4 mb-3 p-5 flex-row items-center">
      <View className="flex-1 mr-4">
        <AppText className="text-[15px] font-semibold text-black mb-2">{title}</AppText>
        <AppText className="text-xs text-black leading-4">{description}</AppText>
      </View>
      {/* 이미지 플레이스홀더 */}
      <View className="w-[100px] h-[100px] bg-festival-card rounded-card-lg" />
    </View>
  );
}
