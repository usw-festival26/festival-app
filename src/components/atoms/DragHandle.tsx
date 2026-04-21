/**
 * DragHandle - 바텀시트 드래그 핸들
 *
 * Figma: 60w x 5h, 중앙 정렬, 회색(#7D7D7D), rounded-full
 */
import React from 'react';
import { View } from 'react-native';

export function DragHandle() {
  return (
    <View className="items-center py-3">
      <View className="w-[60px] h-[5px] bg-festival-muted rounded-full" />
    </View>
  );
}
