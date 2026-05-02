/**
 * MenuBoothCard - 메뉴 목록용 부스 카드 (Figma 920:4750)
 *
 * 카드 165×237: 이미지(흰색+검정 테두리) → 학부명(navy) → "메인메뉴"(회색) → 메뉴 리스트(회색).
 * imageUri가 있으면 그 이미지를, 없으면 빈 플레이스홀더(부스 사진 자리)를 보여준다.
 */
import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface MenuBoothCardProps {
  organizer: string;
  mainMenu?: string;
  menuItems?: string;
  imageUri?: string;
  onPress?: () => void;
}

export function MenuBoothCard({ organizer, mainMenu, menuItems, imageUri, onPress }: MenuBoothCardProps) {
  return (
    <Pressable onPress={onPress} className="flex-1 mx-[13px] mb-[25px] bg-festival-card rounded-card p-3 active:opacity-70">
      {/* 이미지 영역 (Figma 부스 사진 자리) — 흰 배경 + 1px 검정 테두리 */}
      <View className="bg-white border border-black border-solid rounded-[12px] h-[140px] mb-2 overflow-hidden">
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : null}
      </View>
      <AppText
        className="text-[14px] font-semibold text-festival-primary-dark"
        numberOfLines={1}
      >
        {organizer}
      </AppText>
      {mainMenu && (
        <AppText className="text-xs text-festival-muted mt-0.5">{mainMenu}</AppText>
      )}
      {menuItems && (
        <AppText className="text-xs text-festival-muted mt-0.5" numberOfLines={1}>{menuItems}</AppText>
      )}
    </Pressable>
  );
}
