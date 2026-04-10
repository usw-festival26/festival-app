/**
 * BoothMapView - 맵 + 드래그 가능한 바텀시트 (가로 슬라이드 페이징)
 *
 * Figma 82:62 ~ 166:472
 *
 * expanded / activeCategory 분리:
 * - expanded: 시트가 펼쳐졌는지
 * - activeCategory: 현재 표시 중인 카테고리 (시트 접어도 유지)
 */
import React, { useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Animated,
  LayoutChangeEvent,
  GestureResponderEvent,
} from 'react-native';
import { AppText } from '@atoms/AppText';
import { DragHandle } from '@atoms/DragHandle';
import { BoothSheetContent } from './BoothSheetContent';
import { FoodSheetContent } from './FoodSheetContent';
import { FacilitySheetContent } from './FacilitySheetContent';
import { EventSheetContent } from './EventSheetContent';
import type { SheetCategory } from '../../types/map';
import type { Booth } from '../../types/booth';
import type { Facility, FestivalEvent } from '../../types/map';

export interface BoothMapViewProps {
  expanded: boolean;
  activeCategory: SheetCategory;
  booths: Booth[];
  foodBooths: Booth[];
  facilities: Facility[];
  events: FestivalEvent[];
  onExpandedChange: (expanded: boolean) => void;
  onCategoryChange: (category: SheetCategory) => void;
}

const CATEGORIES: SheetCategory[] = ['booth', 'food', 'facility', 'event'];
const COLLAPSED_HEIGHT = 48;
const EXPANDED_RATIO = 0.55;
const SWIPE_THRESHOLD = 40;

export function BoothMapView({
  expanded,
  activeCategory,
  booths,
  foodBooths,
  facilities,
  events,
  onExpandedChange,
  onCategoryChange,
}: BoothMapViewProps) {
  const containerHeightRef = useRef(0);
  const sheetWidthRef = useRef(0);
  const sheetAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // 드래그 추적
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(COLLAPSED_HEIGHT);
  const isDragging = useRef(false);
  const expandedRef = useRef(false);

  // 가로 스와이프 추적
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const swipeDragX = useRef(new Animated.Value(0)).current;

  const getExpandedHeight = () =>
    Math.max(containerHeightRef.current * EXPANDED_RATIO, 300);

  const currentPageIndex = CATEGORIES.indexOf(activeCategory);

  // expanded 변경 시 시트 높이 애니메이션
  useEffect(() => {
    const targetHeight = expanded ? getExpandedHeight() : COLLAPSED_HEIGHT;
    expandedRef.current = expanded;

    Animated.timing(sheetAnim, {
      toValue: targetHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  // 카테고리 변경 시 슬라이드 애니메이션
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentPageIndex,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [currentPageIndex]);

  // --- 핸들 드래그 (세로) ---
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

    // 클릭 (드래그 아닌 경우) → 토글
    if (!isDragging.current) {
      onExpandedChange(!expandedRef.current);
      return;
    }

    // 드래그 방향으로 스냅
    if (dy < -30) {
      onExpandedChange(true);
    } else if (dy > 30) {
      onExpandedChange(false);
    } else {
      // 원래 상태 복귀
      Animated.timing(sheetAnim, {
        toValue: expandedRef.current ? getExpandedHeight() : COLLAPSED_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  // --- 콘텐츠 가로 스와이프 ---
  const onContentTouchStart = (e: GestureResponderEvent) => {
    swipeStartX.current = e.nativeEvent.pageX;
    swipeStartY.current = e.nativeEvent.pageY;
    swipeDragX.setValue(0);
  };

  const onContentTouchMove = (e: GestureResponderEvent) => {
    const dx = e.nativeEvent.pageX - swipeStartX.current;
    const dy = e.nativeEvent.pageY - swipeStartY.current;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      swipeDragX.setValue(dx);
    }
  };

  const onContentTouchEnd = (e: GestureResponderEvent) => {
    const dx = e.nativeEvent.pageX - swipeStartX.current;
    const dy = e.nativeEvent.pageY - swipeStartY.current;

    swipeDragX.setValue(0);

    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

    if (dx < 0 && currentPageIndex < CATEGORIES.length - 1) {
      onCategoryChange(CATEGORIES[currentPageIndex + 1]);
    } else if (dx > 0 && currentPageIndex > 0) {
      onCategoryChange(CATEGORIES[currentPageIndex - 1]);
    }
  };

  const onContainerLayout = (e: LayoutChangeEvent) => {
    containerHeightRef.current = e.nativeEvent.layout.height;
  };

  const onSheetLayout = (e: LayoutChangeEvent) => {
    sheetWidthRef.current = e.nativeEvent.layout.width;
  };

  // 가로 슬라이드 transform
  const sheetWidth = sheetWidthRef.current;
  const translateX =
    sheetWidth > 0
      ? Animated.add(
          slideAnim.interpolate({
            inputRange: [0, CATEGORIES.length - 1],
            outputRange: [0, -(CATEGORIES.length - 1) * sheetWidth],
          }),
          swipeDragX,
        )
      : swipeDragX;

  return (
    <View className="flex-1" onLayout={onContainerLayout}>
      {/* 맵 */}
      <View className="flex-1 bg-festival-primary items-center justify-center">
        <AppText className="text-xl font-black text-center">Main Map</AppText>
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
        onLayout={onSheetLayout}
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

        {/* 가로 슬라이드 콘텐츠 — 항상 렌더링 (expanded 여부와 무관) */}
        {sheetWidth > 0 && (
          <View
            className="flex-1"
            style={{ overflow: 'hidden' }}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderStart={onContentTouchStart}
            onResponderMove={onContentTouchMove}
            onResponderRelease={onContentTouchEnd}
          >
            <Animated.View
              style={{
                flexDirection: 'row',
                width: sheetWidth * CATEGORIES.length,
                flex: 1,
                transform: [{ translateX }],
              }}
            >
              <View style={{ width: sheetWidth, flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <BoothSheetContent booths={booths} />
                  <View className="h-6" />
                </ScrollView>
              </View>

              <View style={{ width: sheetWidth, flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <FoodSheetContent booths={foodBooths} />
                  <View className="h-6" />
                </ScrollView>
              </View>

              <View style={{ width: sheetWidth, flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <FacilitySheetContent facilities={facilities} />
                  <View className="h-6" />
                </ScrollView>
              </View>

              <View style={{ width: sheetWidth, flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <EventSheetContent events={events} />
                  <View className="h-6" />
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
