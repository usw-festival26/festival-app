/**
 * BoothMapView - 맵 + 바텀시트 스타일 부스 그리드
 *
 * Figma 82:62: 맵 영역 상단 + 드래그 핸들 + 2열 부스 카드 그리드
 */
import React from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../atoms/AppText';
import { BoothCard } from '../molecules/BoothCard';
import type { Booth } from '../../types/booth';

export interface BoothMapViewProps {
  booths: Booth[];
}

export function BoothMapView({ booths }: BoothMapViewProps) {
  const router = useRouter();

  return (
    <View className="flex-1">
      {/* 맵 플레이스홀더 */}
      <View className="h-[300px] bg-festival-primary items-center justify-center">
        <AppText variant="h2" className="font-black text-center">
          Main Map
        </AppText>
      </View>

      {/* 바텀시트 스타일 컨테이너 */}
      <View className="flex-1 bg-festival-card rounded-t-[20px] -mt-4">
        {/* 드래그 핸들 */}
        <View className="items-center py-3">
          <View className="w-[53px] h-[3px] bg-festival-secondary rounded-full" />
        </View>

        <AppText variant="h2" className="font-black text-center mb-4">
          부스
        </AppText>

        <FlatList
          data={booths}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-3"
          renderItem={({ item }) => (
            <BoothCard
              title={item.name}
              about={item.description}
              onPress={() => router.push(`/(tabs)/booth/${item.id}`)}
            />
          )}
        />
      </View>
    </View>
  );
}
