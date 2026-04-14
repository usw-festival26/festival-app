/**
 * 홈 화면 - Figma 920:3828
 *
 * 흰색 포스터 패널(헤더 + 메인 포스터 + dot) → 네이비 영역 (Events → About Us → Information 버튼) → 회색 푸터
 */
import React from 'react';
import { View, Pressable, Text } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { ScrollScreenTemplate } from '../../src/components/templates/ScrollScreenTemplate';
import { HeroSection } from '../../src/components/organisms/HeroSection';
import { EventsSection } from '../../src/components/organisms/EventsSection';
import { AboutSection } from '../../src/components/organisms/AboutSection';
import { Footer } from '../../src/components/molecules/Footer';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollScreenTemplate showHeader={false}>
      {/* 흰색 포스터 패널 (헤더 포함) */}
      <HeroSection />

      {/* Events 섹션 */}
      <EventsSection />

      {/* About Us 섹션 */}
      <AboutSection />

      {/* Information 그라디언트 버튼 (Figma 920:3828 — 321×35, -5.76deg, #0D00FF 13.5% → #FFBEBF 84.6%) */}
      <View className="bg-festival-primary-dark" style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 32 }}>
        <Pressable
          onPress={() => router.push('/(tabs)/information' as any)}
          style={{ width: 321, height: 35 }}
          className="active:opacity-80"
        >
          <Svg width={321} height={35} style={{ position: 'absolute', top: 0, left: 0 }}>
            <Defs>
              <LinearGradient id="infoGrad" x1="0.55" y1="1" x2="0.45" y2="0">
                <Stop offset="13.548%" stopColor="#0D00FF" />
                <Stop offset="84.597%" stopColor="#FFBEBF" />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={321} height={35} rx={17.5} ry={17.5} fill="url(#infoGrad)" />
          </Svg>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontFamily: 'Pretendard-SemiBold', color: '#FFFFFF' }}>
              Imformation
            </Text>
          </View>
        </Pressable>
      </View>

      {/* 푸터 */}
      <Footer />
    </ScrollScreenTemplate>
  );
}
