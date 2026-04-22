/**
 * LostFoundList - 분실물 카드 리스트 (Figma 1422:2435)
 *
 * 레이아웃:
 *  - 네이비 배경 (상단 영역): FaqBubble + "문의번호 · 010-1234-5678"
 *  - 반투명 흰 그라디언트 패널(top 0.5 → bottom 0.95): 카테고리 칩 + 카드 리스트 + 페이지 인디케이터
 * 칩: 50×29 rounded-14.5, Pretendard SemiBold 15. 전체 active=#010070/white, 비활성 white/navy.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import type { LostFoundItem, LostFoundCategory } from '../../types/lostFound';
import { LostFoundCard } from '@molecules/LostFoundCard';
import { EmptyState } from '@molecules/EmptyState';
import { FaqBubble } from '@molecules/FaqBubble';

type FilterKey = 'all' | 'electronics' | 'wallet' | 'clothing-bags' | 'other';

const FILTERS: { key: FilterKey; label: string; matches: LostFoundCategory[] }[] = [
  { key: 'all', label: '전체', matches: [] },
  { key: 'electronics', label: '전자기기', matches: ['electronics'] },
  { key: 'wallet', label: '지갑·카드', matches: ['accessories'] },
  { key: 'clothing-bags', label: '의류·가방', matches: ['clothing', 'bags'] },
  { key: 'other', label: '기타', matches: ['other'] },
];

const PAGE_SIZE = 5;

const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });
const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });

export interface LostFoundListProps {
  items: LostFoundItem[];
  isLoading?: boolean;
  error?: string | null;
}

export function LostFoundList({ items, isLoading, error }: LostFoundListProps) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [page, setPage] = useState(0);
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    const f = FILTERS.find((x) => x.key === filter);
    if (!f) return items;
    return items.filter((i) => f.matches.includes(i.category));
  }, [items, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // items / filter 변경으로 totalPages 가 줄어 현재 page 가 범위를 벗어나면 클램프.
  useEffect(() => {
    if (page >= totalPages) setPage(Math.max(0, totalPages - 1));
  }, [page, totalPages]);

  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. 네이비 배경 상단: 말풍선 + 문의번호 */}
      <View style={{ paddingTop: 34, paddingBottom: 20, alignItems: 'center' }}>
        <FaqBubble question="분실물을 습득하셨다면 아래 번호로 연락주세요!" />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginTop: 18,
          }}
        >
          <Text style={styles.contactLabel}>문의번호</Text>
          <View style={styles.dotDivider} />
          <Text style={styles.contactValue}>010-1234-5678</Text>
        </View>
      </View>

      {/* 2. 반투명 흰 그라디언트 패널: 칩 + 카드 + 페이지 */}
      <View style={{ position: 'relative', flex: 1, minHeight: 500 }}>
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

        {/* 칩 */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 14,
            justifyContent: 'center',
          }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => {
                  setFilter(f.key);
                  setPage(0);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${f.label} 필터`}
                accessibilityState={{ selected: active }}
                style={{
                  minWidth: 50,
                  height: 29,
                  borderRadius: 14.5,
                  backgroundColor: active ? '#010070' : '#FFFFFF',
                  paddingHorizontal: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: PRETENDARD_SEMIBOLD,
                    fontWeight: '600',
                    fontSize: 15,
                    color: active ? '#FFFFFF' : '#02015B',
                  }}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 카드 리스트 */}
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
          <View style={{ gap: 12, paddingHorizontal: 21 }}>
            {pageItems.map((item) => (
              <LostFoundCard key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* 페이지 인디케이터 */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 21,
            marginTop: 20,
            paddingBottom: 24 + insets.bottom,
          }}
        >
          <View style={{ flex: 1 }} />
          <Text style={styles.pageIndicator}>
            {page + 1}/{totalPages}
          </Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Pressable
              onPress={() => setPage((p) => (p + 1) % totalPages)}
              accessibilityRole="button"
              accessibilityLabel="다음 페이지"
              disabled={totalPages <= 1}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                opacity: totalPages <= 1 ? 0.4 : pressed ? 0.7 : 1,
              })}
            >
              <Text style={styles.nextLink}>다음페이지</Text>
              <Text style={styles.nextLink}>{'>'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contactLabel: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  contactValue: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  dotDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  pageIndicator: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
  },
  nextLink: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#000000',
  },
});
