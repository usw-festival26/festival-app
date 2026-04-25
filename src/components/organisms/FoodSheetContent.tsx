/**
 * FoodSheetContent - 지도 바텀시트: 푸드트럭 2열 그리드
 *
 * Figma 166:176
 */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '@atoms/AppText';
import { BoothCard } from '@molecules/BoothCard';
import { EmptyState } from '@molecules/EmptyState';
import { Colors } from '@constants/colors';
import type { Booth } from '../../types/booth';

export interface FoodSheetContentProps {
  booths: Booth[];
  isLoading?: boolean;
  error?: string | null;
}

export function FoodSheetContent({ booths, isLoading, error }: FoodSheetContentProps) {
  const router = useRouter();

  const rows: Booth[][] = [];
  for (let i = 0; i < booths.length; i += 2) {
    rows.push(booths.slice(i, i + 2));
  }

  return (
    <View>
      <AppText className="text-xl font-black text-center mb-4">푸드트럭</AppText>
      {isLoading ? (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color={Colors.festival.primaryDark} />
        </View>
      ) : error ? (
        <EmptyState
          message={`푸드트럭을 불러오지 못했습니다.\n${error}`}
          iconName="alert-circle-outline"
        />
      ) : (
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
      )}
    </View>
  );
}
