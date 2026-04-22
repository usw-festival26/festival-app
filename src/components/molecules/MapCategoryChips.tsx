/**
 * MapCategoryChips - 지도 화면 카테고리 칩 (Figma 920:3937)
 *
 * 4개 칩 (전체/부스/푸드/편의). 50×29 rounded-14.5, gap 25.
 * '전체' 선택 시 시트 접힘. 나머지 선택 시 해당 카테고리로 시트 확장.
 *
 * 활성: bg #010070 + 흰 텍스트. 비활성: 흰 bg + 검정 border + 검정 텍스트 (Pretendard SemiBold 15).
 */
import React from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import type { SheetCategory } from '../../types/map';

export type MapChipKey = 'all' | 'booth' | 'food' | 'facility';

const CHIP_OPTIONS: Array<{ key: MapChipKey; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'booth', label: '부스' },
  { key: 'food', label: '푸드' },
  { key: 'facility', label: '편의' },
];

const PRETENDARD_SEMIBOLD = Platform.select({
  web: 'Pretendard Variable',
  default: 'Pretendard-SemiBold',
});

export interface MapCategoryChipsProps {
  expanded: boolean;
  activeCategory: SheetCategory;
  onExpandedChange: (expanded: boolean) => void;
  onCategoryChange: (category: SheetCategory) => void;
}

export function MapCategoryChips({
  expanded,
  activeCategory,
  onExpandedChange,
  onCategoryChange,
}: MapCategoryChipsProps) {
  const activeChip: MapChipKey = expanded ? (activeCategory as MapChipKey) : 'all';

  const handlePress = (key: MapChipKey) => {
    if (key === 'all') {
      onExpandedChange(false);
      return;
    }
    onCategoryChange(key);
    if (!expanded) onExpandedChange(true);
  };

  return (
    <View style={{ flexDirection: 'row', gap: 25, alignItems: 'center' }}>
      {CHIP_OPTIONS.map((opt) => {
        const active = activeChip === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => handlePress(opt.key)}
            accessibilityRole="button"
            accessibilityLabel={`${opt.label} 필터`}
            accessibilityState={{ selected: active }}
            style={{
              width: 50,
              height: 29,
              borderRadius: 14.5,
              backgroundColor: active ? '#010070' : '#FFFFFF',
              borderWidth: active ? 0 : 1,
              borderColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: PRETENDARD_SEMIBOLD,
                fontWeight: '600',
                fontSize: 15,
                color: active ? '#FFFFFF' : '#000000',
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
