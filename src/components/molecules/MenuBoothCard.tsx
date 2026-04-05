/**
 * MenuBoothCard - 메뉴 목록용 부스 카드
 *
 * Figma 135:310: 이미지 + 학부명 + 메인메뉴 + 메뉴 리스트
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface MenuBoothCardProps {
  organizer: string;
  mainMenu?: string;
  menuItems?: string;
  onPress?: () => void;
}

export function MenuBoothCard({ organizer, mainMenu, menuItems, onPress }: MenuBoothCardProps) {
  return (
    <Pressable onPress={onPress} className="flex-1 mx-[13px] mb-[25px] bg-festival-card rounded-card p-3 active:opacity-70">
      {/* 이미지 플레이스홀더 */}
      <View className="bg-festival-primary rounded-[12px] h-[140px] mb-2" />
      <AppText className="text-[15px] font-semibold text-black">{organizer}</AppText>
      {mainMenu && (
        <AppText className="text-xs text-festival-muted mt-0.5">{mainMenu}</AppText>
      )}
      {menuItems && (
        <AppText className="text-xs text-festival-muted mt-0.5">{menuItems}</AppText>
      )}
    </Pressable>
  );
}
