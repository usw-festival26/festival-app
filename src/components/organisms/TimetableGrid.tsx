/**
 * TimetableGrid - 타임테이블 (Figma 1422:2381)
 *
 * 단일 반투명 흰 카드 (368×733, bg rgba(255,255,255,0.8), rounded-20) 안에:
 *  - DAY 1/DAY 2 토글 (navy active/white inactive pill)
 *  - 설명 텍스트
 *  - 시간-타이틀 행(구분선)
 *  - 하단 "라인업 보기" 버튼 (206×40, navy bg, rounded-20)
 */
import React, { useState } from 'react';
import { View, ScrollView, Pressable, Text, Platform, StyleSheet } from 'react-native';
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
  const performances = (currentDay?.performances ?? [])
    .slice()
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <View style={{ flex: 1, paddingTop: 18, paddingHorizontal: 16 }}>
      <View style={styles.card}>
        {/* DAY 토글 */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, paddingTop: 40 }}>
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
                  backgroundColor: active ? '#010070' : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.25,
                  shadowRadius: active ? 5.2 : 6.6,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: PRETENDARD_SEMIBOLD,
                    fontWeight: '600',
                    fontSize: 15,
                    color: active ? '#FFFFFF' : '#010070',
                  }}
                >
                  {`DAY ${index + 1} ${dateStr}`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 설명 */}
        {currentDay?.label ? (
          <Text
            style={{
              fontFamily: PRETENDARD_REGULAR,
              fontWeight: '400',
              fontSize: 12,
              color: '#010070',
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

        {/* 라인업 보기 버튼 */}
        <View style={{ alignItems: 'center', paddingVertical: 16 }}>
          <Pressable
            onPress={() => router.push('/(tabs)/lineup' as any)}
            accessibilityRole="button"
            accessibilityLabel="라인업 보기"
            style={({ pressed }) => ({
              width: 206,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#02015B',
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
                color: '#FFFFFF',
              }}
            >
              라인업 보기
            </Text>
          </Pressable>
        </View>
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
    color: '#000000',
  },
});
