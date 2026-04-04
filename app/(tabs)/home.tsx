/**
 * 홈 화면 - Figma 74:28
 *
 * 메인 포스터 + About Us 섹션 + Information 버튼 + 푸터
 */
import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScrollScreenTemplate } from '../../src/components/templates/ScrollScreenTemplate';
import { HeroSection } from '../../src/components/organisms/HeroSection';
import { AboutSection } from '../../src/components/organisms/AboutSection';
import { AppText } from '../../src/components/atoms/AppText';
import { AppButton } from '../../src/components/atoms/AppButton';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollScreenTemplate showHeader={false}>
      {/* LOGO 헤더 */}
      <View className="flex-row items-center justify-center px-4 py-3 bg-festival-card border-b border-gray-200">
        <AppText variant="h3" className="font-black">LOGO</AppText>
      </View>

      {/* 메인 포스터 */}
      <HeroSection />

      {/* About Us 섹션 x2 */}
      <View className="mt-6">
        <AboutSection title="About Us" />
      </View>
      <View className="mt-2">
        <AboutSection title="About Us" />
      </View>

      {/* Information 버튼 */}
      <View className="px-4 mt-4">
        <AppButton
          variant="outline"
          size="md"
          onPress={() => router.push('/(tabs)/information' as any)}
          className="rounded-full"
        >
          Information
        </AppButton>
      </View>

      {/* 푸터 */}
      <View className="bg-festival-primary mt-6 px-6 py-6">
        <AppText variant="caption" className="text-festival-secondary">
          Copyright . 문의 전화번호 등등...
        </AppText>
      </View>
    </ScrollScreenTemplate>
  );
}
