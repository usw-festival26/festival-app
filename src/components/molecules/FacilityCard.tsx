/**
 * FacilityCard - 편의시설 카드 (가로 레이아웃)
 *
 * Figma 166:259: 이미지(왼) + 이름. 전화번호 라인은 제거됨 — 클릭 시 지도가
 * 해당 핀 위치로 줌인.
 */
import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface FacilityCardProps {
  name: string;
  onPress?: () => void;
}

export function FacilityCard({ name, onPress }: FacilityCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center mx-4 mb-5 py-1 active:opacity-70"
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `${name} 핀으로 이동` : undefined}
    >
      <View className="w-[80px] h-[80px] bg-festival-lavender rounded-[10px] mr-4" />
      <View className="flex-1">
        <AppText className="text-[15px] font-semibold text-black">{name}</AppText>
      </View>
    </Pressable>
  );
}
