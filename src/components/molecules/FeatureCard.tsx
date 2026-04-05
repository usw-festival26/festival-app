/**
 * FeatureCard - 정보 피처 카드
 *
 * Figma 86:953: 아이콘 + 제목 + 부제 + 기능 리스트 + About 버튼
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../atoms/AppText';

export interface FeatureCardProps {
  title: string;
  subtitle: string;
  features: string[];
  onAboutPress?: () => void;
}

export function FeatureCard({ title, subtitle, features, onAboutPress }: FeatureCardProps) {
  return (
    <View className="border border-black rounded-sm px-[38px] py-[29px] items-center gap-[27px]">
      {/* 헤더 */}
      <View className="items-center gap-[5px]">
        <View className="w-[54px] h-[54px] bg-black rounded-full items-center justify-center">
          <Ionicons name="information-circle" size={30} color="#FFFFFF" />
        </View>
        <AppText className="text-xl font-medium text-black text-center">{title}</AppText>
        <AppText className="text-sm text-black text-center">{subtitle}</AppText>
      </View>

      {/* 기능 리스트 */}
      <View className="w-full items-center">
        {features.map((feature, i) => (
          <AppText key={i} className="text-sm text-black/50 text-center leading-[34px]">
            {feature}
          </AppText>
        ))}
      </View>

      {/* About 버튼 */}
      <Pressable
        onPress={onAboutPress}
        className="border border-black rounded-[5px] w-[160px] h-[38px] items-center justify-center active:opacity-70"
      >
        <AppText className="text-sm text-black text-center">About</AppText>
      </Pressable>
    </View>
  );
}
