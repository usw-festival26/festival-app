/**
 * BoothSheetContent - 지도 바텀시트: 부스 2열 그리드
 *
 * Figma 166:93
 *
 * filterLabel: 클러스터(단과대 그룹) 핀으로 필터링됐을 때 단과대명을 헤더로 노출하고
 * "전체" 버튼으로 필터 해제. 없으면 일반 "부스" 헤더.
 */
import { AppText } from '@atoms/AppText';
import { NetworkErrorState } from '@atoms/NetworkErrorState';
import { Colors } from '@constants/colors';
import { BoothCard } from '@molecules/BoothCard';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { Booth } from '../../types/booth';

export interface BoothSheetContentProps {
  booths: Booth[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  /** 클러스터 핀으로 필터링된 경우 단과대명. */
  filterLabel?: string;
  /** 필터 해제 콜백. */
  onClearFilter?: () => void;
}

export function BoothSheetContent({
  booths,
  isLoading,
  error,
  onRetry,
  filterLabel,
  onClearFilter,
}: BoothSheetContentProps) {
  const router = useRouter();

  // 2열 그리드를 위해 짝수 인덱스끼리 묶기
  const rows: Booth[][] = [];
  for (let i = 0; i < booths.length; i += 2) {
    rows.push(booths.slice(i, i + 2));
  }

  return (
    <View>
      {filterLabel ? (
        <View className="flex-row items-center justify-center gap-2 mb-4 px-4">
          <AppText className="text-xl font-black">{filterLabel}</AppText>
          {onClearFilter ? (
            <Pressable onPress={onClearFilter} className="active:opacity-70">
              <AppText className="text-xs text-festival-muted underline">
                전체 보기
              </AppText>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <AppText className="text-xl font-black text-center mb-4">부스</AppText>
      )}
      {isLoading ? (
        <View className="py-6 items-center">
          <ActivityIndicator size="small" color={Colors.festival.primaryDark} />
        </View>
      ) : error ? (
        <NetworkErrorState onRetry={onRetry} />
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
                  imageUri={item.imageUri}
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
