/**
 * MenuTable - 3열 메뉴 테이블 (Main/Side/Set)
 *
 * Figma 135:134: 세로 구분선이 있는 3열 메뉴 표시
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '@atoms/AppText';
import type { BoothMenuItem } from '../../types/booth';

export interface MenuTableProps {
  menuItems: BoothMenuItem[];
}

type MenuCategory = 'main' | 'side' | 'set';

const COLUMN_LABELS: Record<MenuCategory, string> = {
  main: 'Main',
  side: 'Side',
  set: 'Set',
};

export function MenuTable({ menuItems }: MenuTableProps) {
  const grouped: Record<MenuCategory, BoothMenuItem[]> = {
    main: [],
    side: [],
    set: [],
  };

  menuItems.forEach((item) => {
    const cat = item.menuCategory || 'main';
    grouped[cat].push(item);
  });

  const columns: MenuCategory[] = ['main', 'side', 'set'];

  const activeColumns = columns.filter((col) => grouped[col].length > 0);

  return (
    <View className="px-4 py-4">
      {activeColumns.map((col, colIndex) => (
        <View key={col}>
          {colIndex > 0 && (
            <View className="h-px bg-festival-muted/30 my-4" />
          )}
          <AppText className="text-[20px] font-black text-black mb-3">
            {COLUMN_LABELS[col]}
          </AppText>
          {grouped[col].map((item) => (
            <View key={item.id} className="flex-row justify-between items-center mb-2">
              <AppText className="text-[15px] font-semibold text-black">
                {item.name}
              </AppText>
              <AppText className="text-[15px] font-semibold text-black">
                {item.price.toLocaleString()}원
              </AppText>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
