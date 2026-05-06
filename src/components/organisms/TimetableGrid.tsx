/**
 * TimetableGrid - 타임테이블 (Figma 2139:1415)
 *
 * 단일 반투명 흰 카드 (368, bg rgba(255,255,255,0.9), rounded-20) 안에:
 *  - 상단: "{N}일차 라인업 보기" 알약 버튼 → /lineup?day=N
 *  - DAY 1 / DAY 2 토글 (active: primary-light bg / inactive: white)
 *  - 시간-아티스트 행 + 가로 구분선
 *
 * 라인업 진입점 — DAY 1 활성 시 day=1, DAY 2 활성 시 day=2 가 query 로 전달됨.
 * /lineup 화면이 이 값을 읽어 헤더 라벨을 다르게 표시.
 */
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { TimetableDay } from '../../types/timetable';
import { EmptyState } from '@molecules/EmptyState';
import { formatTimeRange } from '@utils/date';

export interface TimetableGridProps {
  days: TimetableDay[];
}

const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

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

        {/* 설명 (label) */}
        {currentDay?.label ? (
          <Text
            style={{
              fontFamily: PRETENDARD_REGULAR,
              fontWeight: '400',
              fontSize: 12,
              color: '#02015B',
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            {currentDay.label}
          </Text>
        ) : null}

        {/* 공연 리스트 */}
        <ScrollView
          style={{ flex: 1, marginTop: 20 }}
          contentContainerStyle={{ paddingHorizontal: 34, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {performances.length === 0 ? (
            <View style={{ paddingTop: 40 }}>
              <EmptyState message="이 날짜의 공연이 없습니다." iconName="calendar-outline" />
            </View>
          ) : (
            performances.map((p) => (
              <View key={p.id} style={styles.row}>
                <Text style={styles.rowTime}>{formatTimeRange(p.startTime, p.endTime)}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  rowTime: {
    width: 110,
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#02015B',
  },
  rowTitle: {
    flex: 1,
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#001E56',
    textAlign: 'center',
  },
});
