/**
 * 메뉴 목록 화면 - Figma 135:310
 *
 * 2열 부스 메뉴 카드 그리드. 공용 BackdropScreenTemplate 로 헤더/배경을 통일.
 */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { MenuBoothCard } from '../../../src/components/molecules/MenuBoothCard';
import { useBooths } from '../../../src/hooks/useBooths';

export default function MenuListScreen() {
  const router = useRouter();
  const { booths } = useBooths();

  const rows: (typeof booths[0])[][] = [];
  for (let i = 0; i < booths.length; i += 2) {
    rows.push(booths.slice(i, i + 2));
  }

  return (
    <BackdropScreenTemplate title="메뉴" backdropVariant="menu">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 24, paddingBottom: 32 }}>
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
    </BackdropScreenTemplate>
  );
}
