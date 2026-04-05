/**
 * InfoSection - 제목 + 본문 텍스트 블록
 *
 * Figma 86:953: Information 화면의 각 섹션
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface InfoSectionProps {
  title: string;
  body: string;
}

export function InfoSection({ title, body }: InfoSectionProps) {
  return (
    <View className="mb-6">
      <AppText className="text-[15px] font-semibold text-black mb-2">
        {title}
      </AppText>
      <AppText className="text-xs text-black leading-5">
        {body}
      </AppText>
    </View>
  );
}
