/**
 * DrawerContent - 사이드 드로어 메뉴
 *
 * 회색 배경, X 닫기, 메뉴 항목 세로 나열
 */
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DrawerMenuItem {
  label: string;
  route: string;
}

// Figma node 947:461 기준 드로어 메뉴 구성.
const MENU_ITEMS: DrawerMenuItem[] = [
  { label: '지도', route: '/(tabs)/booth' },
  { label: '부스 / 메뉴', route: '/(tabs)/menu' },
  { label: '타임테이블', route: '/(tabs)/timetable' },
  { label: '공지', route: '/(tabs)/announcements' },
  { label: '분실물', route: '/(tabs)/lost-found' },
  { label: '이벤트', route: '/(tabs)/events' },
];

export function DrawerContent({ navigation }: DrawerContentComponentProps) {
  const router = useRouter();

  const handlePress = (route: string) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    router.replace(route as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-festival-lavender" edges={['top', 'bottom']}>
      <View className="flex-1 px-[16px] pt-[20px]">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
          className="w-[30px] h-[30px] items-center justify-center mb-[30px] active:opacity-70"
        >
          <Ionicons name="close" size={28} color="#000000" />
        </Pressable>

        <View className="gap-[32px]">
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => handlePress(item.route)}
              className="active:opacity-70"
            >
              <Text className="text-[26px] font-bold font-pretendard text-festival-text">
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
