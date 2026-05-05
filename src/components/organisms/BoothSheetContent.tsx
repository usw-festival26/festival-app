/**
 * BoothSheetContent - 지도 바텀시트: 단과대 카드 그리드 OR 부스 2열 그리드
 *
 * Figma 166:93
 *
 * 동작 분기 (filterLabel 유무):
 *  - filterLabel 비어 있음 (클러스터 미선택) → 단과대 카드 그리드 (CollegeGrid).
 *    카드 탭 시 `onSelectCluster(cluster.id)` — 부모가 selectedClusterId 를 set 해
 *    이 컴포넌트가 다시 렌더되면 부스 그리드 모드로 전환된다.
 *  - filterLabel 있음 (클러스터 선택됨) → 그 단과대 부스만 보이는 2열 그리드 +
 *    "전체 보기" 버튼으로 필터 해제 (= 단과대 카드 그리드 복귀).
 */
import { AppText } from '@atoms/AppText';
import { NetworkErrorState } from '@atoms/NetworkErrorState';
import { Colors } from '@constants/colors';
import { BoothCard } from '@molecules/BoothCard';
import { CollegeGrid } from './CollegeGrid';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { Booth } from '../../types/booth';
import type { BoothCluster } from '../../types/cluster';

export interface BoothSheetContentProps {
  booths: Booth[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  /** 클러스터 핀으로 필터링된 경우 단과대명. */
  filterLabel?: string;
  /** 필터 해제 콜백. */
  onClearFilter?: () => void;
  /** 단과대 카드 그리드 모드용 — filterLabel 비어 있을 때 표시할 클러스터 목록. */
  clusters?: BoothCluster[];
  /** 단과대 카드 탭 핸들러 — selectedClusterId 를 set 해 부스 그리드로 전환. */
  onSelectCluster?: (clusterId: string) => void;
}

export function BoothSheetContent({
  booths,
  isLoading,
  error,
  onRetry,
  filterLabel,
  onClearFilter,
  clusters,
  onSelectCluster,
}: BoothSheetContentProps) {
  const router = useRouter();

  // 단과대 미선택 + 카드 모드 사용 가능 → 단과대 카드 그리드 렌더
  const showCollegeCards = !filterLabel && clusters && onSelectCluster;

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
        <AppText className="text-xl font-black text-center mb-4">
          {showCollegeCards ? '단과대' : '부스'}
        </AppText>
      )}
      {showCollegeCards ? (
        <CollegeGrid
          clusters={clusters!}
          onPressCollege={(c) => onSelectCluster!(c.id)}
          embedded
        />
      ) : isLoading ? (
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
