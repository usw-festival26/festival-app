/**
 * MenuGrid - 메뉴 화면 2열 부스 카드 그리드 (Figma 135:310)
 *
 * 라우트(app/(tabs)/menu/index.tsx)는 훅 값(booths/isLoading/error)만 전달하고
 * 그리드 행 분할 · 메인 메뉴 문자열 조합 · 로딩/에러/empty 분기는 여기서 처리한다.
 */
import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import type { Booth } from '../../types/booth';
import { MenuBoothCard } from '@molecules/MenuBoothCard';
import { EmptyState } from '@molecules/EmptyState';
import { Colors } from '@constants/colors';

export interface MenuGridProps {
  booths: Booth[];
  isLoading?: boolean;
  error?: string | null;
}

export function MenuGrid({ booths, isLoading, error }: MenuGridProps) {
  const router = useRouter();

  const rows: Booth[][] = [];
  for (let i = 0; i < booths.length; i += 2) {
    rows.push(booths.slice(i, i + 2));
  }

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 24, paddingBottom: 32 }}>
      {isLoading ? (
        <View className="py-12 items-center">
          <ActivityIndicator size="small" color={Colors.festival.primaryDark} />
        </View>
      ) : error ? (
        <EmptyState
          message={`메뉴를 불러오지 못했습니다.\n${error}`}
          iconName="alert-circle-outline"
        />
      ) : rows.length === 0 ? (
        <EmptyState message="등록된 부스가 없습니다." iconName="storefront-outline" />
      ) : (
        rows.map((row, i) => (
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
        ))
      )}
    </ScrollView>
  );
}
