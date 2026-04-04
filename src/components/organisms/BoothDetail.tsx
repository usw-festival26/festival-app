/**
 * BoothDetail - 부스 상세 (메뉴 테이블)
 *
 * Figma 135:134: 학과명 필 + 이미지 + 3열 메뉴 테이블 + 부스 공지
 */
import React from 'react';
import { ScrollView, View } from 'react-native';
import type { Booth } from '../../types/booth';
import { AppText } from '../atoms/AppText';
import { MenuTable } from '../molecules/MenuTable';

export interface BoothDetailProps {
  booth: Booth;
}

export function BoothDetail({ booth }: BoothDetailProps) {
  return (
    <ScrollView className="flex-1 bg-festival-bg">
      {/* 메인 카드 */}
      <View className="mx-4 mt-4 bg-festival-card rounded-[20px] p-6">
        {/* 학과/부스 이름 필 */}
        <View className="items-center mb-4">
          <View className="bg-festival-card rounded-full px-6 py-2">
            <AppText variant="h3" className="font-black text-center">
              {booth.organizer}
            </AppText>
          </View>
        </View>

        {/* 이미지 플레이스홀더 */}
        <View className="bg-festival-primary rounded-[20px] h-[162px] mb-6" />

        {/* 메뉴 테이블 */}
        <MenuTable menuItems={booth.menuItems} />
      </View>

      {/* 부스 공지 */}
      <View className="mx-4 mt-4 mb-8">
        <AppText variant="body" className="font-semibold mb-2">
          학과별 부스 공지
        </AppText>
        <AppText variant="caption" className="leading-5">
          {booth.description}
        </AppText>
      </View>
    </ScrollView>
  );
}
