/**
 * DotPagination - 온보딩 dot 인디케이터
 *
 * Figma 74:9: 3개 dot, 활성=검정 넓은바, 비활성=회색 원
 */
import React from 'react';
import { View } from 'react-native';

export interface DotPaginationProps {
  total: number;
  current: number;
}

export function DotPagination({ total, current }: DotPaginationProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-[7px] rounded-full ${
            i === current ? 'w-[20px] bg-black' : 'w-[7px] bg-festival-secondary'
          }`}
        />
      ))}
    </View>
  );
}
