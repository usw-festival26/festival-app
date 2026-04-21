/**
 * 홈 화면 - Figma 1334:802
 *
 * 흰색 포스터 패널(HeroSection) → 네이비 영역(ScreenBackdrop + Events → Line up → About Us) → 회색 푸터
 * Information 버튼은 About Us 카드 내부에 흡수.
 */
import React from 'react';
import { View } from 'react-native';
import { ScrollScreenTemplate } from '../../src/components/templates/ScrollScreenTemplate';
import { HeroSection } from '../../src/components/organisms/HeroSection';
import { EventsSection } from '../../src/components/organisms/EventsSection';
import { LineupSection } from '../../src/components/organisms/LineupSection';
import { AboutSection } from '../../src/components/organisms/AboutSection';
import { ScreenBackdrop } from '../../src/components/atoms/ScreenBackdrop';
import { Footer } from '../../src/components/molecules/Footer';

export default function HomeScreen() {
  return (
    <ScrollScreenTemplate showHeader={false}>
      {/* 흰색 포스터 패널 (헤더 포함) */}
      <HeroSection />

      {/* 네이비 영역 — ScreenBackdrop(home) blob 2개 + Events/Line up/About Us */}
      <View
        className="bg-festival-primary-dark"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <ScreenBackdrop variant="home" />

        <EventsSection />
        <LineupSection />
        <AboutSection />
      </View>

      {/* 푸터 */}
      <Footer />
    </ScrollScreenTemplate>
  );
}
