/**
 * 지도 화면 - Figma 82:62 ~ 166:472
 *
 * 헤더(제목+필터칩) + 맵 + 바텀시트(드래그+가로페이징)
 */
import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { AppText } from '../../../src/components/atoms/AppText';
import { Chip } from '../../../src/components/atoms/Chip';
import { BoothMapView } from '../../../src/components/organisms/BoothMapView';
import { useBooths } from '../../../src/hooks/useBooths';
import { FACILITIES_DATA } from '../../../src/data/facilities';
import { EVENTS_DATA } from '../../../src/data/events';
import type { SheetCategory } from '../../../src/types/map';

const FILTER_LABELS = ['전체', '부스', '푸드', '편의', '행사'];
const LABEL_TO_CATEGORY: Record<string, SheetCategory | 'all'> = {
  '전체': 'all',
  '부스': 'booth',
  '푸드': 'food',
  '편의': 'facility',
  '행사': 'event',
};

export default function BoothListScreen() {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SheetCategory>('booth');

  const { booths: allBooths } = useBooths();
  const boothItems = allBooths.filter((b) => b.category !== 'food' && b.category !== 'drink');
  const foodItems = allBooths.filter((b) => b.category === 'food' || b.category === 'drink');

  // 칩에 표시할 활성 라벨
  const activeLabel = expanded
    ? FILTER_LABELS.find((l) => LABEL_TO_CATEGORY[l] === activeCategory) ?? '전체'
    : '전체';

  const handleChipPress = (label: string) => {
    const value = LABEL_TO_CATEGORY[label];
    if (value === 'all') {
      setExpanded(false);
    } else {
      setActiveCategory(value as SheetCategory);
      setExpanded(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-festival-bg" edges={['top']}>
      {/* 헤더: 제목 + 필터 칩 */}
      <View className="bg-festival-card rounded-b-card-lg px-4 pb-3 pt-2">
        <View className="flex-row items-center justify-between h-[44px]">
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="w-[30px] h-[30px] items-center justify-center active:opacity-70"
          >
            <Ionicons name="menu" size={26} color="#000000" />
          </Pressable>
          <AppText className="text-xl font-black text-festival-text text-center">지도</AppText>
          <AppText className="text-xl font-black text-festival-text">LOGO</AppText>
        </View>

        {/* 필터 칩 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 pt-2 pb-1 justify-center flex-1"
        >
          {FILTER_LABELS.map((label) => (
            <Chip
              key={label}
              label={label}
              selected={label === activeLabel}
              onPress={() => handleChipPress(label)}
            />
          ))}
        </ScrollView>
      </View>

      <BoothMapView
        expanded={expanded}
        activeCategory={activeCategory}
        booths={boothItems}
        foodBooths={foodItems}
        facilities={FACILITIES_DATA}
        events={EVENTS_DATA}
        onExpandedChange={setExpanded}
        onCategoryChange={setActiveCategory}
      />
    </SafeAreaView>
  );
}
