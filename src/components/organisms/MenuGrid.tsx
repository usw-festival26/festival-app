/**
 * MenuGrid - 메뉴 화면 2열 부스 카드 그리드 (Figma 135:310)
 *
 * 라우트(app/(tabs)/menu/index.tsx)는 훅 값(booths/isLoading/error)만 전달하고
 * 그리드 행 분할 · 로딩/에러/empty 분기는 여기서 처리한다.
 *
 * 메뉴 미리보기 문자열은 카드별 `useBoothMenus(booth.id)` 호출로 생성 (N+1).
 * 부스 list 응답에 메뉴가 포함되지 않는 백엔드 스펙을 수용하기 위함.
 */
import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import type { Booth } from '../../types/booth';
import { MenuBoothCard } from '@molecules/MenuBoothCard';
import { EmptyState } from '@molecules/EmptyState';
import { NetworkErrorState } from '@atoms/NetworkErrorState';
import { Colors } from '@constants/colors';
import { useBoothMenus } from '@hooks/useBooths';

export interface MenuGridProps {
  booths: Booth[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

interface MenuBoothCardItemProps {
  booth: Booth;
  onPress: () => void;
}

/**
 * 부스 카드 1장 단위로 메뉴를 따로 받아 메인 메뉴 문자열을 구성한다.
 * (백엔드: 부스 list 응답엔 메뉴가 없고 `/api/booths/{id}/menu` 별도 엔드포인트만 제공)
 *
 * menuCategory 가 백엔드 응답에서 누락되는 경우(`mapMenu`)를 감안해 undefined 는 'main' 으로 간주.
 */
function MenuBoothCardItem({ booth, onPress }: MenuBoothCardItemProps) {
  const { menus } = useBoothMenus(booth.id);
  // useBoothMenus 는 항상 array 를 반환하지만 hook 내부 변경 가능성 대비 방어 ?? [].
  const mainMenus = (menus ?? [])
    .filter((m) => (m.menuCategory ?? 'main') === 'main')
    .map((m) => m.name)
    .join(', ');
  return (
    <MenuBoothCard
      organizer={booth.organizer ?? booth.name}
      // mainMenus 가 비어 있으면 라벨도 숨김 (메뉴 없는 카드에 "메인메뉴" 만 단독 표시되는 것 방지).
      mainMenu={mainMenus ? '메인메뉴' : undefined}
      menuItems={mainMenus || undefined}
      imageUri={booth.imageUri}
      onPress={onPress}
    />
  );
}

export function MenuGrid({ booths, isLoading, error, onRetry }: MenuGridProps) {
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
        <NetworkErrorState onRetry={onRetry} />
      ) : rows.length === 0 ? (
        <EmptyState message="등록된 부스가 없습니다." iconName="storefront-outline" />
      ) : (
        rows.map((row, i) => (
          <View key={i} className="flex-row">
            {row.map((item) => (
              <MenuBoothCardItem
                key={item.id}
                booth={item}
                onPress={() => router.push(`/(tabs)/menu/${item.id}` as any)}
              />
            ))}
            {row.length === 1 && <View className="flex-1 mx-[13px]" />}
          </View>
        ))
      )}
    </ScrollView>
  );
}
