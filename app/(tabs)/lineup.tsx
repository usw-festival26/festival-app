/**
 * 라인업 화면 - Figma 920:4289
 *
 * 네이비 배경 + 상단 흰색 둥근 헤더(햄버거 + 라인업 + LOGO) + Festival Lineup + ArtistCard 스택
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { AppText } from '../../src/components/atoms/AppText';
import { ScrollScreenTemplate } from '../../src/components/templates/ScrollScreenTemplate';
import { LineupList } from '../../src/components/organisms/LineupList';
import { useLineup } from '../../src/hooks/useLineup';

export default function LineupScreen() {
  const navigation = useNavigation();
  const { data } = useLineup();

  return (
    <ScrollScreenTemplate showHeader={false}>
      {/* 상단 흰색 둥근 헤더 */}
      <View className="bg-festival-card h-[105px] rounded-bl-[20px] rounded-br-[20px] flex-row items-center justify-between px-4">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className="w-[30px] h-[30px] items-center justify-center active:opacity-70"
        >
          <Ionicons name="menu" size={28} color="#000" />
        </Pressable>
        <AppText className="text-[20px] font-black text-black font-roboto">라인업</AppText>
        <AppText className="text-[20px] font-black text-black font-roboto">LOGO</AppText>
      </View>

      <LineupList artists={data} />
    </ScrollScreenTemplate>
  );
}
