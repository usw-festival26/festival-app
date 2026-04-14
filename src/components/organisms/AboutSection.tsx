/**
 * AboutSection - 홈 About Us (Figma 920:3828)
 *
 * 라벨 중앙 Roboto Black 20 white, 카드 368×254 rounded-12 흰색.
 * 우측 하단 blob 289 (Ellipse70) 장식.
 */
import React from 'react';
import { View } from 'react-native';
import { RobotoBlackText } from '../atoms/RobotoBlackText';
import { GradientBlob } from '../atoms/GradientBlob';

export interface AboutSectionProps {
  title?: string;
}

export function AboutSection({ title = 'About Us' }: AboutSectionProps) {
  return (
    <View
      className="bg-festival-primary-dark"
      style={{ paddingTop: 41, paddingBottom: 16, overflow: 'hidden', position: 'relative' }}
    >
      {/* 우측 blob 289 — Figma Ellipse70 (position 283,748 within home) */}
      <View pointerEvents="none" style={{ position: 'absolute', right: -120, top: -60, opacity: 0.9 }}>
        <GradientBlob size={289} gradientId="about-blob" />
      </View>

      <View style={{ marginBottom: 16 }}>
        <RobotoBlackText size={20} lineHeight={23} color="#FFFFFF">
          {title}
        </RobotoBlackText>
      </View>
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 368,
            height: 254,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
          }}
        />
      </View>
    </View>
  );
}
