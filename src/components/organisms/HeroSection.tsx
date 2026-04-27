/**
 * HeroSection - 홈 흰색 포스터 패널 (Figma 920:3828)
 *
 * 프레임 402×615. 햄버거(16,61)만 헤더. Main/Poster 중앙(top:285).
 * 좌/우 화살표 (14,294)/(360,294). Dot pagination (183,596), 4개.
 */
import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { RobotoBlackText } from '@atoms/RobotoBlackText';

const POSTER_COUNT = 4;
const PANEL_HEIGHT = 615;

export function HeroSection() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : POSTER_COUNT - 1));
  const goNext = () => setCurrentIndex((i) => (i < POSTER_COUNT - 1 ? i + 1 : 0));

  return (
    <View className="bg-festival-card w-full" style={{ height: PANEL_HEIGHT }}>
      {/* 햄버거 — Figma (16, 61)은 상태바 포함 좌표. SafeAreaView가 상태바를 이미 처리하므로 44px 뺀 top:17 사용 */}
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ position: 'absolute', left: 16, top: 17, width: 30, height: 30 }}
        className="items-center justify-center active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="메뉴 열기"
      >
        <Ionicons name="menu" size={28} color="#000" />
      </Pressable>

      {/* Main / Poster 텍스트 — 수직 중앙 (top:285) */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 285 }}>
        <RobotoBlackText size={20} lineHeight={23} color="#000000">
          Main
        </RobotoBlackText>
        <RobotoBlackText size={20} lineHeight={23} color="#000000">
          Poster
        </RobotoBlackText>
      </View>

      {/* 좌측 화살표 (14, 294) */}
      <Pressable
        onPress={goPrev}
        style={{ position: 'absolute', left: 14, top: 294, width: 28, height: 28 }}
        className="items-center justify-center active:opacity-70"
      >
        <Ionicons name="chevron-back" size={28} color="#000" />
      </Pressable>

      {/* 우측 화살표 (360, 294) */}
      <Pressable
        onPress={goNext}
        style={{ position: 'absolute', left: 360, top: 294, width: 28, height: 28 }}
        className="items-center justify-center active:opacity-70"
      >
        <Ionicons name="chevron-forward" size={28} color="#000" />
      </Pressable>

      {/* Dot pagination (183, 596) w:36 h:6 */}
      <View
        style={{
          position: 'absolute',
          left: 183,
          top: 596,
          width: 36,
          height: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {Array.from({ length: POSTER_COUNT }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: i === currentIndex ? '#010070' : '#D9D9D9',
            }}
          />
        ))}
      </View>
    </View>
  );
}
