/**
 * ScreenHeader - 공통 화면 헤더
 *
 * 햄버거 아이콘(좌), 제목(중앙), LOGO(우) 레이아웃
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { AppText } from '../atoms/AppText';

export interface ScreenHeaderProps {
  title?: string;
  showHamburger?: boolean;
}

export function ScreenHeader({ title, showHamburger = true }: ScreenHeaderProps) {
  const navigation = useNavigation();

  return (
    <View className="bg-festival-card border-b border-gray-200 px-4 pb-3 pt-2">
      <View className="flex-row items-center justify-between h-[44px]">
        {showHamburger ? (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="w-[30px] h-[30px] items-center justify-center"
          >
            <Ionicons name="menu" size={26} color="#000000" />
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
