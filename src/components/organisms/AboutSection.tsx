/**
 * AboutSection - 홈 화면 About Us 섹션
 *
 * Figma 74:28: 제목 + 둥근 이미지 카드 플레이스홀더
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface AboutSectionProps {
  title?: string;
}

export function AboutSection({ title = 'About Us' }: AboutSectionProps) {
  return (
    <View className="mb-4">
      <AppText variant="label" className="font-bold mb-2 px-4 text-festival-text">
        {title}
      </AppText>
      <View className="mx-4 bg-festival-primary rounded-[20px] h-[200px]" />
    </View>
  );
}
