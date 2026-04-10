/**
 * BoothDetail - 부스 상세 (메뉴 테이블)
 *
 * Figma 135:134: 뒤로가기 + 학과명 + 이미지/포스터 + 3열 메뉴 테이블 + 부스 공지
 */
import React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Booth } from '../../types/booth';
import { AppText } from '@atoms/AppText';
import { MenuTable } from '@molecules/MenuTable';

export interface BoothDetailProps {
  booth: Booth;
}

export function BoothDetail({ booth }: BoothDetailProps) {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-festival-bg">
      {/* 메인 카드 */}
      <View className="mx-4 mt-4 bg-festival-card rounded-card-lg p-6">
        {/* 뒤로가기 + 학과/부스 이름 */}
        <View className="flex-row items-center mb-4">
          <Pressable onPress={() => router.back()} className="mr-3 active:opacity-70">
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </Pressable>
          <AppText className="text-[15px] font-semibold text-black text-center flex-1">
            {booth.organizer}
          </AppText>
          <View className="w-[24px]" />
        </View>

        {/* 이미지 + 설명 가로 배치 */}
        <View className="flex-row mb-6 gap-4">
          {/* 이미지/포스터 플레이스홀더 */}
          <View className="bg-festival-primary rounded-card-lg w-[165px] h-[181px] items-center justify-center">
            <AppText className="text-[15px] font-semibold text-black text-center">
              위치(지도) 또는 포스터
            </AppText>
          </View>

          {/* 부스 설명 */}
          <View className="flex-1 flex-shrink">
            <AppText className="text-[15px] font-semibold text-black mb-2">
              부스 안내
            </AppText>
            <AppText className="text-xs text-black leading-5">
              {booth.description}
            </AppText>
          </View>
        </View>

        {/* 메뉴 테이블 */}
        <MenuTable menuItems={booth.menuItems} />
      </View>
    </ScrollView>
  );
}
