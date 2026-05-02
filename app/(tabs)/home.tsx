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
import { CardBannerSection } from '../../src/components/organisms/CardBannerSection';
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

      {/* 네이비 영역 — 상단 네이비 띠 → 카드 배너(full-bleed) → ScreenBackdrop(home) blob + Events/Line up/About Us */}
      <View
        className="bg-festival-primary-dark"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <ScreenBackdrop variant="home" />

        {/* 카드 배너 위쪽 네이비 여백 */}
        <View style={{ height: 40 }} />

        {/* 카드 배너 (자유전공학부 팔찌 안내) - full-bleed */}
        <CardBannerSection />

        <EventsSection />
        <LineupSection />
        <AboutSection />
      </View>

      {/* 푸터 */}
      <Footer />
    </ScrollScreenTemplate>
  );
}
