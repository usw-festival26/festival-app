/**
 * TimetableGrid - 무대 시각화 + 드래그 가능한 바텀시트
 *
 * Figma 82:82: 무대 뷰 위에 바텀시트(DAY 선택 + 공연 리스트)
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Animated, LayoutChangeEvent, GestureResponderEvent } from 'react-native';
import type { Stage, TimetableDay } from '../../types/timetable';
import { AppText } from '../atoms/AppText';
import { Chip } from '../atoms/Chip';
import { DragHandle } from '../atoms/DragHandle';
import { TimeSlot } from '../molecules/TimeSlot';
import { StageVisualization } from '../molecules/StageVisualization';
import { EmptyState } from '../molecules/EmptyState';
import { formatTimeRange } from '../../utils/date';

export interface TimetableGridProps {
  days: TimetableDay[];
  stages: Stage[];
}

const COLLAPSED_HEIGHT = 48;
const EXPANDED_RATIO = 0.6;

export function TimetableGrid({ days, stages }: TimetableGridProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const containerHeightRef = useRef(0);
  const sheetAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const expandedRef = useRef(false);

  // 드래그 추적
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(COLLAPSED_HEIGHT);
  const isDragging = useRef(false);

  const currentDay = days[selectedDayIndex];

  const getExpandedHeight = () =>
    Math.max(containerHeightRef.current * EXPANDED_RATIO, 350);

  if (days.length === 0) {
    return <EmptyState message="등록된 공연이 없습니다." iconName="calendar-outline" />;
  }

  const allPerformances = (currentDay?.performances ?? [])
    .slice()
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // expanded 변경 시 애니메이션
  useEffect(() => {
    const targetHeight = expanded ? getExpandedHeight() : COLLAPSED_HEIGHT;
    expandedRef.current = expanded;
    Animated.timing(sheetAnim, {
      toValue: targetHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  // 핸들 드래그
  const onHandleTouchStart = (e: GestureResponderEvent) => {
    dragStartY.current = e.nativeEvent.pageY;
    dragStartHeight.current = expandedRef.current ? getExpandedHeight() : COLLAPSED_HEIGHT;
    isDragging.current = false;
  };

  const onHandleTouchMove = (e: GestureResponderEvent) => {
    const dy = e.nativeEvent.pageY - dragStartY.current;
    if (Math.abs(dy) > 5) isDragging.current = true;
    const expandedHeight = getExpandedHeight();
    const newHeight = Math.max(
      COLLAPSED_HEIGHT,
      Math.min(dragStartHeight.current - dy, expandedHeight),
    );
    sheetAnim.setValue(newHeight);
  };

  const onHandleTouchEnd = (e: GestureResponderEvent) => {
    const dy = e.nativeEvent.pageY - dragStartY.current;

    if (!isDragging.current) {
      setExpanded(!expandedRef.current);
      return;
    }

    if (dy < -30) {
      setExpanded(true);
    } else if (dy > 30) {
      setExpanded(false);
    } else {
      Animated.timing(sheetAnim, {
        toValue: expandedRef.current ? getExpandedHeight() : COLLAPSED_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const onContainerLayout = (e: LayoutChangeEvent) => {
    containerHeightRef.current = e.nativeEvent.layout.height;
  };

  return (
    <View
      className="flex-1"
      onLayout={onContainerLayout}
    >
      {/* 무대 시각화 */}
      <View className="flex-1">
        <StageVisualization />
      </View>

      {/* 바텀시트 */}
      <Animated.View
        style={{
          height: sheetAnim,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          overflow: 'hidden',
        }}
      >
        {/* 드래그 핸들 */}
        <View
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderStart={onHandleTouchStart}
          onResponderMove={onHandleTouchMove}
          onResponderRelease={onHandleTouchEnd}
          style={{ cursor: 'grab' } as any}
        >
          <DragHandle />
        </View>

        {/* 시트 콘텐츠 */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* DAY 선택 */}
          <View className="flex-row justify-center gap-5 px-4 py-2">
            {days.map((day, index) => {
              const dateStr = day.date.slice(5).replace('-', '.');
              return (
                <Chip
                  key={day.date}
                  label={`DAY ${index + 1}  ${dateStr}`}
                  variant="dayPill"
                  selected={index === selectedDayIndex}
                  onPress={() => setSelectedDayIndex(index)}
                />
              );
            })}
          </View>

          {/* 설명 */}
          <AppText className="text-xs text-black text-center mt-2 mb-4">
            {currentDay?.label ?? ''}
          </AppText>

          {/* 공연 리스트 */}
          {allPerformances.length === 0 ? (
            <EmptyState message="이 날짜의 공연이 없습니다." iconName="calendar-outline" />
          ) : (
            <View>
              {allPerformances.map((item) => (
                <TimeSlot
                  key={item.id}
                  time={formatTimeRange(item.startTime, item.endTime)}
                  title={item.artistName}
                />
              ))}
            </View>
          )}
          <View className="h-6" />
        </ScrollView>
      </Animated.View>
    </View>
  );
}
