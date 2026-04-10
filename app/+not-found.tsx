/**
 * 404 페이지 - Figma 382:850
 *
 * X 닫기(우측 상단) + 중앙 404 Error + 설명 + 하단 우측 메인으로 가기(——>)
 */
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

// TODO: 벡터 이미지 경로로 교체
// import ArrowIcon from '../assets/arrow-right.svg';
// 또는 const ARROW_ICON = require('../assets/arrow-right.png');

export default function NotFoundScreen() {
  const router = useRouter();

  const goHome = () => router.replace('/(tabs)/home' as any);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        {/* node 382:859 — X 닫기 버튼, 우측 상단 */}
        <View className="items-end pr-4 pt-2">
          <Pressable
            onPress={goHome}
            className="w-[30px] h-[30px] items-center justify-center active:opacity-70"
          >
            <Ionicons name="close" size={28} color="#000" />
          </Pressable>
        </View>

        {/* 중앙 영역 — 404 Error + 설명 */}
        <View className="flex-1 items-center justify-center">
          {/* node 382:851 — "404"와 "Error"는 사이즈가 다름, 각각 수정 */}
          <View className="flex-row items-baseline">
            {/* "404" */}
            <Text className="text-[61px] font-black text-black font-roboto leading-[45px]">
              404
            </Text>
            {/* "Error" */}
            <Text className="text-[33px] font-black text-black font-roboto leading-[45px]">
              {' '}Error
            </Text>
          </View>

          {/* node 382:854 — 설명 텍스트 */}
          <Text className="text-[12px] text-black text-center mt-2 font-pretendard">
            요청하신 페이지를 찾을 수 없습니다
          </Text>
        </View>

        {/* node 382:858 — 하단 우측 메인으로 가기 + 선 화살표 */}
        <Pressable
          onPress={goHome}
          className="flex-row items-center self-end pb-10 pr-8 gap-2 active:opacity-70"
        >
          <Text className="text-[12px] text-black font-pretendard">
            메인으로 가기
          </Text>
          <Svg width={27} height={7} viewBox="0 0 27 7" fill="none">
            <Path d="M0 6.34326H25L19.3333 0.343262" stroke="black" />
          </Svg>
        </Pressable>
      </SafeAreaView>
    </>
  );
}
