/**
 * FacilityCard - 편의시설 카드 (가로 레이아웃)
 *
 * Figma 166:259: 이미지(왼) + 이름 + 전화번호(오)
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface FacilityCardProps {
  name: string;
  phone: string;
}

export function FacilityCard({ name, phone }: FacilityCardProps) {
  return (
    <View className="flex-row items-center mx-4 mb-5 py-1">
      {/* 이미지 플레이스홀더 */}
      <View className="w-[80px] h-[80px] bg-festival-lavender rounded-[10px] mr-4" />
      <View className="flex-1">
        <AppText className="text-[15px] font-semibold text-black mb-1">{name}</AppText>
        <View className="flex-row items-center gap-[5px]">
          <AppText className="text-xs text-festival-muted">call</AppText>
          <View className="w-[3px] h-[3px] rounded-full bg-festival-muted" />
          <AppText className="text-xs text-festival-muted">{phone}</AppText>
        </View>
      </View>
    </View>
  );
}
