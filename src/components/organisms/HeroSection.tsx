/**
 * HeroSection - 홈 화면 메인 포스터 영역
 *
 * Figma 74:28: 큰 포스터 플레이스홀더 + 중앙 텍스트
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';

export function HeroSection() {
  return (
    <View className="h-[400px] bg-festival-primary items-center justify-center">
      <AppText variant="h2" className="font-black text-center">
        Main
      </AppText>
      <AppText variant="h2" className="font-black text-center">
        Poster
      </AppText>
    </View>
  );
}
