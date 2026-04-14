/**
 * StageVisualization - 타임테이블 무대 시각화
 *
 * Figma 82:82: 회색 배경 + 흰색 십자형 블록 + "무대" 레이블
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';

export function StageVisualization() {
  return (
    <View className="flex-1 bg-festival-primary-dark items-center justify-center">
      <View className="items-center">
        {/* 가로 블록 */}
        <View className="bg-festival-card w-[245px] h-[120px] rounded-sm" />
        {/* 세로 블록 (겹침) */}
        <View className="bg-festival-card w-[106px] h-[80px] -mt-3 rounded-sm" />
      </View>
      <AppText className="text-xl font-black text-white absolute">무대</AppText>
    </View>
  );
}
