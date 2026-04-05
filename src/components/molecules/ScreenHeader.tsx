/**
 * ScreenHeader - 공통 화면 헤더
 *
 * Figma: 흰 배경, 하단 둥근 모서리(20px), 햄버거/뒤로가기 + 제목 + LOGO
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AppText } from '../atoms/AppText';

export interface ScreenHeaderProps {
  title?: string;
  leftAction?: 'hamburger' | 'back' | 'none';
  /** @deprecated showHamburger 대신 leftAction 사용 */
  showHamburger?: boolean;
}

export function ScreenHeader({
  title,
  leftAction,
  showHamburger = true,
}: ScreenHeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();

  const resolvedAction = leftAction ?? (showHamburger ? 'hamburger' : 'none');

  return (
    <View className="bg-festival-card rounded-b-card-lg px-4 pb-4 pt-2">
      <View className="flex-row items-center justify-between h-[44px]">
        {resolvedAction === 'hamburger' ? (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="w-[30px] h-[30px] items-center justify-center active:opacity-70"
          >
            <Ionicons name="menu" size={26} color="#000000" />
          </Pressable>
        ) : resolvedAction === 'back' ? (
          <Pressable
            onPress={() => router.back()}
            className="w-[30px] h-[30px] items-center justify-center active:opacity-70"
          >
            <Ionicons name="chevron-back" size={26} color="#000000" />
          </Pressable>
        ) : (
          <View className="w-[30px]" />
        )}

        {title ? (
          <AppText className="text-xl font-black text-festival-text text-center">
            {title}
          </AppText>
        ) : (
          <View />
        )}

        <AppText className="text-xl font-black text-festival-text">LOGO</AppText>
      </View>
    </View>
  );
}
