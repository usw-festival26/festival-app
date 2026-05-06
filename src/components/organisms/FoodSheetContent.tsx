/**
 * FoodSheetContent - 지도 바텀시트: 푸드트럭 2열 그리드
 *
 * Figma 166:176
 *
 * 데이터 통합 — booths(category='food' 부스) + foodPins(지도 핀 전용 푸드트럭) 둘
 * 다 한 그리드에 표시. 푸드핀의 boothId 가 booths 중 하나와 매칭되면 booth 카드만
 * 남기고 핀은 skip(중복 방지). booth 카드도 매칭되는 푸드핀의 coords 를 가져와서,
 * 카드 누름 시 그 핀 위치로 지도가 줌인.
 */
import React, { useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AppText } from '@atoms/AppText';
import { BoothCard } from '@molecules/BoothCard';
import { NetworkErrorState } from '@atoms/NetworkErrorState';
import { Colors } from '@constants/colors';
import type { Booth } from '../../types/booth';
import type { FoodPin } from '../../types/cluster';
import type { MapCoords } from '../../types/map';

export interface FoodSheetContentProps {
  booths: Booth[];
  /** 지도 핀 전용 푸드트럭 — booth 가 없는 푸드만 카드로 추가 표시. */
  foodPins?: FoodPin[];
  /** 카드 누름 시 해당 핀 좌표로 지도 줌인. coords 없는 카드는 비활성. */
  onItemPress?: (coords: MapCoords) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

interface FoodCard {
  id: string;
  name: string;
  description?: string;
  imageUri?: string;
  location?: string;
  /** 매칭 푸드핀이 있으면 그 좌표 — 없으면 카드 클릭 비활성. */
  coords?: MapCoords;
}

export function FoodSheetContent({ booths, foodPins, onItemPress, isLoading, error, onRetry }: FoodSheetContentProps) {
  const cards = useMemo<FoodCard[]>(() => {
    const pinByBoothId = new Map<string, FoodPin>();
    for (const p of foodPins ?? []) {
      if (p.boothId) pinByBoothId.set(p.boothId, p);
    }
    const seenBoothIds = new Set<string>();
    const merged: FoodCard[] = booths.map((b) => {
      seenBoothIds.add(b.id);
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        imageUri: b.imageUri,
        location: b.location,
        coords: pinByBoothId.get(b.id)?.coords,
      };
    });
    for (const p of foodPins ?? []) {
      if (p.boothId && seenBoothIds.has(p.boothId)) continue;
      merged.push({
        id: p.id,
        name: p.name,
        description: p.description,
        coords: p.coords,
      });
    }
    return merged;
  }, [booths, foodPins]);

  const rows: FoodCard[][] = [];
  for (let i = 0; i < cards.length; i += 2) {
    rows.push(cards.slice(i, i + 2));
  }

  return (
    <View>
      <AppText className="text-xl font-black text-center mb-4">푸드트럭</AppText>
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
                  onPress={
                    item.coords && onItemPress
                      ? () => onItemPress(item.coords!)
                      : undefined
                  }
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
