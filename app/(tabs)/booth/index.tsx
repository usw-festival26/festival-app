/**
 * 부스/지도 화면 - Figma 82:62
 *
 * 필터 칩 + 맵 플레이스홀더 + 바텀시트 부스 그리드
 */
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../src/components/molecules/ScreenHeader';
import { FilterChipRow } from '../../../src/components/atoms/FilterChipRow';
import { BoothMapView } from '../../../src/components/organisms/BoothMapView';
import { useBooths } from '../../../src/hooks/useBooths';
import type { BoothCategory } from '../../../src/types/booth';

const CATEGORY_MAP: Record<string, BoothCategory | undefined> = {
  '전체': undefined,
  '부스': 'experience',
  '푸드': 'food',
  '편의': 'merchandise',
  '게임': 'game',
};

const CATEGORIES = ['전체', '부스', '푸드', '편의', '게임'];

export default function BoothListScreen() {
  const [selected, setSelected] = useState('전체');
  const { booths } = useBooths({ category: CATEGORY_MAP[selected] });

  return (
    <SafeAreaView className="flex-1 bg-festival-bg" edges={['top']}>
      <ScreenHeader title="지도" />
      <FilterChipRow
        categories={CATEGORIES}
        selected={selected}
        onSelect={setSelected}
      />
      <BoothMapView booths={booths} />
    </SafeAreaView>
  );
}
