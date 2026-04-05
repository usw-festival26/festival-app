/**
 * FacilitySheetContent - 지도 바텀시트: 편의시설 리스트
 *
 * Figma 166:259
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';
import { FacilityCard } from '../molecules/FacilityCard';
import type { Facility } from '../../types/map';

export interface FacilitySheetContentProps {
  facilities: Facility[];
}

export function FacilitySheetContent({ facilities }: FacilitySheetContentProps) {
  return (
    <View>
      <AppText className="text-xl font-black text-center mb-4">편의시설</AppText>
      {facilities.map((item) => (
        <FacilityCard key={item.id} name={item.name} phone={item.phone} />
      ))}
    </View>
  );
}
