/**
 * BoothSheetContent - 지도 바텀시트: 부스 2열 그리드
 *
 * Figma 166:93
 */
import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@atoms/AppText';
import { BoothCard } from '@molecules/BoothCard';
import type { Booth } from '../../types/booth';

export interface BoothSheetContentProps {
  booths: Booth[];
}

export function BoothSheetContent({ booths }: BoothSheetContentProps) {
  const router = useRouter();

  // 2열 그리드를 위해 짝수 인덱스끼리 묶기
  const rows: Booth[][] = [];
  for (let i = 0; i < booths.length; i += 2) {
    rows.push(booths.slice(i, i + 2));
  }

  return (
    <View>
      <AppText className="text-xl font-black text-center mb-4">부스</AppText>
      <View className="px-3">
        {rows.map((row, i) => (
          <View key={i} className="flex-row">
            {row.map((item) => (
              <BoothCard
                key={item.id}
                title={item.name}
                time={item.location}
                about={item.description}
                onPress={() => router.push(`/(tabs)/booth/${item.id}`)}
              />
            ))}
            {row.length === 1 && <View className="flex-1 mx-1" />}
          </View>
        ))}
      </View>
    </View>
  );
}
