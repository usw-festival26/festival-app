/**
 * SplashContent - 스플래시 화면 본문
 *
 * Figma 74:7: 회색 배경 + MAIN LOGO + 터치 안내
 */
import React from 'react';
import { Pressable } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface SplashContentProps {
  onPress: () => void;
}

export function SplashContent({ onPress }: SplashContentProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 bg-[#d9d9d9] items-center justify-center"
    >
      <AppText className="text-[48px] font-black text-black text-center leading-[40px]">
        MAIN{'\n'}LOGO
      </AppText>
      <AppText className="text-[12px] text-black text-center mt-8">
        화면을 터치해주세요
      </AppText>
    </Pressable>
  );
}
