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
import { RobotoBlackText } from '../../../src/components/atoms/RobotoBlackText';
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
    <SafeAreaView className="flex-1 bg-festival-primary-dark" edges={['top']}>
      {/* 헤더 (Figma 920:3931) — 흰색 h:155 rounded-b-20, 햄버거/지도/LOGO + 필터칩 */}
      <View
        style={{
          height: 155,
          backgroundColor: '#FFFFFF',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        {/* 햄버거 (16, 61) */}
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ position: 'absolute', left: 16, top: 61, width: 30, height: 30 }}
          className="items-center justify-center active:opacity-70"
        >
          <Ionicons name="menu" size={28} color="#000000" />
        </Pressable>

        {/* "지도" 중앙 (top:67) */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 67 }}>
          <RobotoBlackText size={20} lineHeight={23} color="#000000">
            지도
          </RobotoBlackText>
        </View>

        {/* LOGO 우측 (left ~334, top:67) */}
        <View style={{ position: 'absolute', right: 24, top: 67 }}>
          <RobotoBlackText size={20} lineHeight={23} color="#000000">
            LOGO
          </RobotoBlackText>
        </View>

        {/* 필터칩 가로 스크롤 (top:111) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ position: 'absolute', left: 0, right: 0, top: 111 }}
          contentContainerStyle={{
            gap: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
          }}
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
