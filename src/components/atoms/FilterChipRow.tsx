/**
 * FilterChipRow - 수평 스크롤 필터 칩 목록
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { Chip } from './Chip';

export interface FilterChipRowProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function FilterChipRow({ categories, selected, onSelect }: FilterChipRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 gap-4 py-2"
    >
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          selected={cat === selected}
          onPress={() => onSelect(cat)}
        />
      ))}
    </ScrollView>
  );
}
