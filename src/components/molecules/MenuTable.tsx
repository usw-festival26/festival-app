/**
 * MenuTable - 3열 메뉴 테이블 (Main/Side/Set)
 *
 * Figma 135:134: 세로 구분선이 있는 3열 메뉴 표시
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';
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

  return (
    <View className="flex-row px-2 py-4">
      {columns.map((col, idx) => (
        <React.Fragment key={col}>
          <View className="flex-1">
            <AppText variant="h3" className="font-black mb-3">
              {COLUMN_LABELS[col]}
            </AppText>
            {grouped[col].map((item) => (
              <AppText
                key={item.id}
                variant="body"
                className="font-semibold mb-2"
              >
                {item.name}
              </AppText>
            ))}
          </View>
          {idx < columns.length - 1 && (
            <View className="w-[1px] bg-festival-secondary mx-2" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
