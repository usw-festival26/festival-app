/**
 * SplashContent - 스플래시 화면 본문
 *
 * Figma 74:7: 검정 배경 + MAIN LOGO + 터치 안내
 */
import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText } from '@atoms/AppText';

export interface SplashContentProps {
  onPress: () => void;
}

export function SplashContent({ onPress }: SplashContentProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 bg-black items-center justify-center"
    >
      <AppText className="text-[48px] font-black text-white text-center leading-[40px]">
        MAIN{'\n'}LOGO
      </AppText>
      <View className="absolute bottom-24 w-full items-center">
        <AppText className="text-[12px] text-[#d9d9d9] text-center">
          화면을 터치해주세요
        </AppText>
      </View>
    </Pressable>
  );
}
