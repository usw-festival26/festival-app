/**
 * LostFoundList - 분실물 카드 리스트 (Figma 1228:1018)
 *
 * 반투명 흰 그라디언트 패널 위에 필터칩 + LostFoundCard 스택.
 * 하단: 1/3 페이지 인디케이터 + "다음페이지" 링크.
 */
import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import type { LostFoundItem, LostFoundCategory } from '../../types/lostFound';
import { Chip } from '@atoms/Chip';
import { LostFoundCard } from '@molecules/LostFoundCard';
import { EmptyState } from '@molecules/EmptyState';

type FilterKey = 'all' | LostFoundCategory;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'electronics', label: '전자기기' },
  { key: 'clothing', label: '의류' },
  { key: 'accessories', label: '액세서리' },
  { key: 'bags', label: '가방' },
  { key: 'other', label: '기타' },
];

const PAGE_SIZE = 5;

export interface LostFoundListProps {
  items: LostFoundItem[];
  isLoading?: boolean;
  error?: string | null;
  onPressItem?: (item: LostFoundItem) => void;
}

export function LostFoundList({ items, isLoading, error, onPressItem }: LostFoundListProps) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="lost-found-panel" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.95" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#lost-found-panel)" />
      </Svg>

      <ScrollView
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24, alignItems: 'stretch' }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 14 }}
        >
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              selected={filter === f.key}
              onPress={() => {
                setFilter(f.key);
                setPage(0);
              }}
            />
          ))}
        </ScrollView>

        {isLoading ? (
          <View style={{ paddingTop: 48, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#02015B" />
          </View>
        ) : error ? (
          <View style={{ paddingTop: 48 }}>
            <EmptyState
              message={`분실물을 불러오지 못했습니다.\n${error}`}
              iconName="alert-circle-outline"
            />
          </View>
        ) : pageItems.length === 0 ? (
          <View style={{ paddingTop: 48 }}>
            <EmptyState message="등록된 분실물이 없습니다." iconName="search-outline" />
          </View>
        ) : (
          <View style={{ gap: 12, paddingHorizontal: 16, width: '100%' }}>
            {pageItems.map((item) => (
              <LostFoundCard
                key={item.id}
                item={item}
                onPress={() => onPressItem?.(item)}
              />
            ))}
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginTop: 20,
          }}
        >
          <Text style={styles.pageIndicator}>
            {page + 1}/{totalPages}
          </Text>
          <Pressable
            onPress={() => setPage((p) => (p + 1) % totalPages)}
            accessibilityRole="button"
            accessibilityLabel="다음 페이지"
            disabled={totalPages <= 1}
            style={({ pressed }) => ({
              opacity: totalPages <= 1 ? 0.4 : pressed ? 0.7 : 1,
            })}
          >
            <Text style={styles.nextLink}>다음페이지</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pageIndicator: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-SemiBold' }),
    fontWeight: '600',
    fontSize: 13,
    color: '#02015B',
  },
  nextLink: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-SemiBold' }),
    fontWeight: '600',
    fontSize: 13,
    color: '#0D00FF',
    textDecorationLine: 'underline',
  },
});
