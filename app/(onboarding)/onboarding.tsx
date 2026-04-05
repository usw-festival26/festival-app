/**
 * 온보딩 화면 - Figma 74:9, 74:11, 74:13
 *
 * 3페이지, Next/Start 버튼 + dot 인디케이터
 */
import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { AppText } from '../../src/components/atoms/AppText';
import { DotPagination } from '../../src/components/atoms/DotPagination';
import { useOnboarding } from '../../src/hooks/useOnboarding';

const PAGES = [
  { title: '온보딩 이미지 1', description: '축제의 모든 정보를 한눈에 확인하세요' },
  { title: '온보딩 이미지 2', description: '부스와 푸드트럭 위치를 지도에서 찾아보세요' },
  { title: '온보딩 이미지 3', description: '타임테이블로 공연 일정을 놓치지 마세요' },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === PAGES.length - 1;
  const page = PAGES[currentIndex];

  const handleNext = async () => {
    if (isLast) {
      await completeOnboarding();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* 콘텐츠 영역 */}
      <View className="flex-1 items-center justify-center px-12">
        {/* 이미지 플레이스홀더 */}
        <View className="w-[300px] h-[300px] bg-festival-primary rounded-card-xl items-center justify-center mb-8">
          <AppText className="text-[15px] font-semibold text-black text-center">
            {page.title}
          </AppText>
        </View>
        {/* 설명 */}
        <AppText className="text-[15px] font-semibold text-black text-center w-[266px]">
          {page.description}
        </AppText>
      </View>

      {/* 하단 영역 */}
      <View className="items-center pb-16 gap-4">
        <Pressable
          onPress={handleNext}
          className="w-[80px] h-[45px] bg-festival-primary rounded-full items-center justify-center active:opacity-70"
        >
          <AppText className="text-[15px] font-semibold text-festival-muted text-center">
            {isLast ? 'Start!' : 'Next'}
          </AppText>
        </Pressable>

        <DotPagination total={PAGES.length} current={currentIndex} />
      </View>
    </View>
  );
}
