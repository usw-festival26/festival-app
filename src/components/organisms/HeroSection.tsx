/**
 * HeroSection - 홈 화면 메인 포스터 영역
 *
 * Figma 74:28: 포스터 플레이스홀더 + 좌우 화살표 + dot 인디케이터
 */
import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../atoms/AppText';
import { DotPagination } from '../atoms/DotPagination';

const POSTER_COUNT = 4;

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : POSTER_COUNT - 1));
  };

  const goNext = () => {
    setCurrentIndex((i) => (i < POSTER_COUNT - 1 ? i + 1 : 0));
  };

  return (
    <View className="bg-festival-primary">
      {/* 포스터 영역 */}
      <View className="h-[560px] items-center justify-center relative">
        {/* 좌측 화살표 */}
        <Pressable
          onPress={goPrev}
          className="absolute left-3 z-10 w-[28px] h-[28px] items-center justify-center active:opacity-70"
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </Pressable>

        {/* 포스터 텍스트 */}
        <AppText className="text-[20px] font-black text-black text-center leading-[23px]">
          Main{'\n'}Poster
        </AppText>

        {/* 우측 화살표 */}
        <Pressable
          onPress={goNext}
          className="absolute right-3 z-10 w-[28px] h-[28px] items-center justify-center active:opacity-70"
        >
          <Ionicons name="chevron-forward" size={28} color="#000" />
        </Pressable>
      </View>

      {/* Dot 인디케이터 */}
      <View className="pb-5">
        <DotPagination total={POSTER_COUNT} current={currentIndex} />
      </View>
    </View>
  );
}
