/**
 * TimeSlot - 타임테이블 공연 슬롯
 *
 * @example
 * <TimeSlot
 *   time="17:00 - 18:00"
 *   title="밴드 A"
 *   location="메인 무대"
 *   stageColor="#FF6B6B"
 *   onPress={() => {}}
 * />
 */
import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface TimeSlotProps {
  time: string;
  title: string;
  location?: string;
  /** 무대 대표 색상 (좌측 바에 사용) */
  stageColor?: string;
  onPress?: () => void;
  className?: string;
}

export function TimeSlot({
  time,
  title,
  location,
  stageColor = '#6366F1',
  onPress,
  className = '',
}: TimeSlotProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center rounded-lg bg-festival-card p-3 shadow-sm active:opacity-70 ${className}`}
    >
      <View className="mr-3 w-1 self-stretch rounded-full" style={{ backgroundColor: stageColor }} />
      <View className="flex-1">
        <AppText variant="caption">{time}</AppText>
        <AppText variant="body" className="font-semibold">
          {title}
        </AppText>
        {location && <AppText variant="caption">{location}</AppText>}
      </View>
    </Pressable>
  );
}
