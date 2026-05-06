/**
 * FacilitySheetContent - 지도 바텀시트: 편의시설 리스트
 *
 * Figma 166:259
 *
 * facilityPins 받아서 카드로 렌더. 카드 누르면 해당 핀 좌표로 줌인 콜백.
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '@atoms/AppText';
import { FacilityCard } from '@molecules/FacilityCard';
import type { FacilityPin } from '../../types/cluster';
import type { MapCoords } from '../../types/map';

export interface FacilitySheetContentProps {
  facilityPins: FacilityPin[];
  /** 카드 누름 시 해당 핀 좌표로 지도 줌인. */
  onItemPress?: (coords: MapCoords) => void;
}

export function FacilitySheetContent({ facilityPins, onItemPress }: FacilitySheetContentProps) {
  return (
    <View>
      <AppText className="text-xl font-black text-center mb-4">편의시설</AppText>
      {facilityPins.map((p) => (
        <FacilityCard
          key={p.id}
          name={p.name}
          onPress={onItemPress ? () => onItemPress(p.coords) : undefined}
        />
      ))}
    </View>
  );
}
