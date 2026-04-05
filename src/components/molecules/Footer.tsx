/**
 * Footer - 공통 푸터
 *
 * Figma: 회색 배경 + copyright 텍스트
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';

export function Footer() {
  return (
    <View className="bg-festival-primary px-6 py-8">
      <AppText className="text-[9px] text-festival-muted leading-4">
        Copyright . 문의 전화번호 등...
      </AppText>
    </View>
  );
}
