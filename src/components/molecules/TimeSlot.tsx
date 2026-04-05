/**
 * TimeSlot - 타임테이블 공연 슬롯
 *
 * Figma 82:82: 시간(왼쪽) + 타이틀(오른쪽) + 하단 구분선
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';
import { Divider } from '../atoms/Divider';

export interface TimeSlotProps {
  time: string;
  title: string;
  location?: string;
  stageColor?: string;
  onPress?: () => void;
  className?: string;
}

export function TimeSlot({
  time,
  title,
  className = '',
}: TimeSlotProps) {
  return (
    <View className={className}>
      <View className="flex-row items-center px-4 py-4">
        <AppText className="text-xs text-black w-[120px]">{time}</AppText>
        <AppText className="text-[15px] font-semibold text-black flex-1">{title}</AppText>
      </View>
      <Divider className="mx-4" />
    </View>
  );
}
