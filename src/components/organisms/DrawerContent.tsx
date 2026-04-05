/**
 * DrawerContent - 사이드 드로어 메뉴
 *
 * 회색 배경, X 닫기, 메뉴 항목 세로 나열
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../atoms/AppText';

interface DrawerMenuItem {
  label: string;
  route: string;
  matchPath: string;
}

const MENU_ITEMS: DrawerMenuItem[] = [
  { label: '홈', route: '/(tabs)/home', matchPath: '/home' },
  { label: '지도', route: '/(tabs)/booth', matchPath: '/booth' },
  { label: '메뉴', route: '/(tabs)/menu', matchPath: '/menu' },
  { label: '타임테이블', route: '/(tabs)/timetable', matchPath: '/timetable' },
  { label: '공지', route: '/(tabs)/announcements', matchPath: '/announcements' },
  { label: '분실물', route: '/(tabs)/lost-found', matchPath: '/lost-found' },
  { label: '추가정보', route: '/(tabs)/information', matchPath: '/information' },
];

export function DrawerContent() {
  const navigation = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (route: string) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    router.replace(route as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-festival-primary" edges={['top', 'bottom']}>
      <View className="flex-1 px-[24px] pt-[18px]">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
          className="w-[30px] h-[30px] items-center justify-center mb-10 active:opacity-70"
        >
          <Ionicons name="close" size={28} color="#000000" />
        </Pressable>

        <View className="gap-[28px]">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname.includes(item.matchPath);
            return (
              <Pressable
                key={item.label}
                onPress={() => handlePress(item.route)}
                className="active:opacity-70"
              >
                <AppText
                  className={`text-2xl font-black ${isActive ? 'text-black' : 'text-festival-muted'}`}
                >
                  {item.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
