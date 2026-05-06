/**
 * TimetableGrid - 타임테이블 (Figma 2139:1415)
 *
 * 단일 반투명 흰 카드 (368, bg rgba(255,255,255,0.9), rounded-20) 안에:
 *  - 상단: "{N}일차 라인업 보기" 알약 버튼 → /lineup?day=N
 *  - DAY 1 / DAY 2 토글 (active: primary-light bg / inactive: white)
 *  - 시간(시작만) - 아티스트 행 + 가로 구분선 (행 높이 67px)
 *
 * 라인업 진입점 — DAY 1 활성 시 day=1, DAY 2 활성 시 day=2 가 query 로 전달됨.
 * /lineup 화면이 이 값을 읽어 헤더 라벨을 다르게 표시.
 */
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { TimetableDay } from '../../types/timetable';
import { EmptyState } from '@molecules/EmptyState';
import { formatTime } from '@utils/date';

export interface TimetableGridProps {
  days: TimetableDay[];
}

const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

// Figma 2139:1415 — 시간 라벨 사이 67px, 시간 텍스트 좌측 고정 width.
const ROW_HEIGHT = 67;
const TIME_WIDTH = 60;
const CARD_INNER_PADDING_X = 53;

export function TimetableGrid({ days }: TimetableGridProps) {
  const router = useRouter();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (days.length === 0) {
    return <EmptyState message="등록된 공연이 없습니다." iconName="calendar-outline" />;
  }

  const currentDay = days[selectedDayIndex];
  // 시간순 정렬은 currentDay 가 바뀔 때만 재계산.
  const performances = useMemo(
    () =>
      (currentDay?.performances ?? [])
        .slice()
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [currentDay],
  );
  const dayNumber = selectedDayIndex + 1;

  return (
    <View style={{ flex: 1, paddingTop: 18, paddingHorizontal: 16 }}>
      <View style={styles.card}>
        {/* "N일차 라인업 보기" — Figma 2139:1459 (266×40, bg #C3EDFF) */}
        <View style={{ alignItems: 'center', paddingTop: 29 }}>
          <Pressable
            onPress={() =>
              router.push(`/(tabs)/lineup?day=${dayNumber}` as any)
            }
            accessibilityRole="link"
            accessibilityLabel={`${dayNumber}일차 라인업 보기`}
            style={({ pressed }) => ({
              width: 266,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#C3EDFF',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: PRETENDARD_SEMIBOLD,
                fontWeight: '600',
                fontSize: 15,
                color: '#010070',
              }}
            >
              {`${dayNumber}일차 라인업 보기`}
            </Text>
          </Pressable>
        </View>

        {/* DAY 토글 — Figma 2139:1462 (active: primary-light, inactive: white) */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 19, paddingTop: 32 }}>
          {days.map((day, index) => {
            const active = index === selectedDayIndex;
            const dateStr = day.date.slice(5).replace('-', '.');
            return (
              <Pressable
                key={day.date}
                onPress={() => setSelectedDayIndex(index)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 11,
                  borderRadius: 20,
                  backgroundColor: active ? '#C3EDFF' : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.25,
                  shadowRadius: active ? 3.3 : 2.6,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: PRETENDARD_SEMIBOLD,
                    fontWeight: '600',
                    fontSize: 15,
                    color: active ? '#010070' : '#004466',
                  }}
                >
                  {`DAY ${index + 1}  ${dateStr}`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 공연 리스트 — Figma DAY 토글 → 첫 행 사이 여백 40px */}
        <ScrollView
          style={{ flex: 1, marginTop: 40 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {performances.length === 0 ? (
            <View style={{ paddingTop: 40 }}>
              <EmptyState message="이 날짜의 공연이 없습니다." iconName="calendar-outline" />
            </View>
          ) : (
            performances.map((p) => (
              <View key={p.id} style={styles.row}>
                <Text style={styles.rowTime}>{formatTime(p.startTime)}</Text>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {p.artistName}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  // 시간 라벨 좌측 고정, 아티스트 텍스트는 카드 가운데 정렬 (시간폭만큼 우측 여백으로 시각적 균형).
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    marginHorizontal: CARD_INNER_PADDING_X,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  rowTime: {
    width: TIME_WIDTH,
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#02015B',
  },
  rowTitle: {
    flex: 1,
    marginRight: TIME_WIDTH,
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#001E56',
    textAlign: 'center',
  },
});
