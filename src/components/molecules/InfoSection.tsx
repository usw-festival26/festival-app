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
      <AppText variant="body" className="font-semibold mb-2">
        {title}
      </AppText>
      <AppText variant="caption" className="leading-5">
        {body}
      </AppText>
    </View>
  );
}
