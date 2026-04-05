/**
 * 메뉴 목록 화면 - Figma 135:310
 *
 * 2열 부스 메뉴 카드 그리드
 */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '../../../src/components/molecules/ScreenHeader';
import { MenuBoothCard } from '../../../src/components/molecules/MenuBoothCard';
import { useBooths } from '../../../src/hooks/useBooths';

export default function MenuListScreen() {
  const router = useRouter();
  const { booths } = useBooths();

  // 2열 그리드
  const rows: (typeof booths[0])[][] = [];
  for (let i = 0; i < booths.length; i += 2) {
    rows.push(booths.slice(i, i + 2));
  }

  return (
    <SafeAreaView className="flex-1 bg-festival-bg" edges={['top']}>
      <ScreenHeader title="메뉴" />
      <ScrollView contentContainerClassName="px-[10px] pt-4 pb-8">
        {rows.map((row, i) => (
          <View key={i} className="flex-row">
            {row.map((item) => {
              const mainMenus = item.menuItems
                .filter((m) => m.menuCategory === 'main')
                .map((m) => m.name)
                .join(', ');
              return (
                <MenuBoothCard
                  key={item.id}
                  organizer={item.organizer}
                  mainMenu="메인메뉴"
                  menuItems={mainMenus || undefined}
                  onPress={() => router.push(`/(tabs)/menu/${item.id}` as any)}
                />
              );
            })}
            {row.length === 1 && <View className="flex-1 mx-[13px]" />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
