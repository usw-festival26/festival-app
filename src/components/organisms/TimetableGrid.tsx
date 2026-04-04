/**
 * TimetableGrid - 타임테이블 전체 뷰
 *
 * 날짜별 탭 + 무대별 공연 슬롯을 표시합니다.
 */
import React, { useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import type { Stage, TimetableDay } from '../../types/timetable';
import { AppText } from '../atoms/AppText';
import { Chip } from '../atoms/Chip';
import { TimeSlot } from '../molecules/TimeSlot';
import { EmptyState } from '../molecules/EmptyState';
import { Divider } from '../atoms/Divider';
import { formatTimeRange } from '../../utils/date';

export interface TimetableGridProps {
  days: TimetableDay[];
  stages: Stage[];
}

export function TimetableGrid({ days, stages }: TimetableGridProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const currentDay = days[selectedDayIndex];

  if (days.length === 0) {
    return <EmptyState message="등록된 공연이 없습니다." iconName="calendar-outline" />;
  }

  /** 무대별로 공연 그룹핑 */
  const performancesByStage = stages.map((stage) => ({
    stage,
    performances: (currentDay?.performances ?? [])
      .filter((p) => p.stageId === stage.id)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
  }));

  return (
    <View className="flex-1">
      {/* 날짜 선택 칩 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 py-3 gap-2"
      >
        {days.map((day, index) => (
          <Chip
            key={day.date}
            label={day.label}
            selected={index === selectedDayIndex}
            onPress={() => setSelectedDayIndex(index)}
          />
        ))}
      </ScrollView>

      {/* 무대별 공연 목록 */}
      <FlatList
        data={performancesByStage}
        keyExtractor={(item) => item.stage.id}
        contentContainerClassName="px-4 pb-4"
        ItemSeparatorComponent={() => <Divider className="my-3" />}
        renderItem={({ item }) => (
          <View className="mb-2">
            {/* 스테이지 헤더 */}
            <View className="flex-row items-center mb-3 mt-2">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.stage.color }}
              />
              <AppText variant="h3" className="flex-1">
                {item.stage.name}
              </AppText>
              <AppText variant="caption">
                {item.stage.location}
              </AppText>
            </View>
            {item.performances.length === 0 ? (
              <AppText variant="caption">이 무대의 공연이 없습니다.</AppText>
            ) : (
              <View className="gap-2">
                {item.performances.map((perf) => (
                  <TimeSlot
                    key={perf.id}
                    time={formatTimeRange(perf.startTime, perf.endTime)}
                    title={perf.artistName}
                    location={perf.description}
                    stageColor={item.stage.color}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
