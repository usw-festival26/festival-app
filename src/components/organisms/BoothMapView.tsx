/**
 * BoothMapView - 맵 + 드래그 가능한 바텀시트 (가로 슬라이드 페이징)
 *
 * Figma 82:62 ~ 166:472, 920:3931 — 카테고리 칩은 헤더(ScreenHeader subHeader)로 이동했다.
 * 이 organism 은 맵 placeholder + 줌 컨트롤 + 바텀시트만 담당.
 *
 * expanded / activeCategory 분리:
 * - expanded: 시트가 펼쳐졌는지
 * - activeCategory: 현재 표시 중인 카테고리 (시트 접어도 유지)
 *
 * 좌하단 +/- 버튼 — 맵 placeholder 확대/축소 (0.5x ~ 2.5x).
 */
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Animated,
  LayoutChangeEvent,
  GestureResponderEvent,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

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

  const dragStartY = useRef(0);
  const dragStartHeight = useRef(COLLAPSED_HEIGHT);
  const isDragging = useRef(false);
  const expandedRef = useRef(false);

  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const swipeDragX = useRef(new Animated.Value(0)).current;

  const [zoom, setZoom] = useState(1);

  const getExpandedHeight = () =>
    Math.max(containerHeightRef.current * EXPANDED_RATIO, 300);

  const currentPageIndex = CATEGORIES.indexOf(activeCategory);

  useEffect(() => {
    const targetHeight = expanded ? getExpandedHeight() : COLLAPSED_HEIGHT;
    expandedRef.current = expanded;

    Animated.timing(sheetAnim, {
      toValue: targetHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentPageIndex,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [currentPageIndex]);

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
      onExpandedChange(!expandedRef.current);
      return;
    }

    if (dy < -30) {
      onExpandedChange(true);
    } else if (dy > 30) {
      onExpandedChange(false);
    } else {
      Animated.timing(sheetAnim, {
        toValue: expandedRef.current ? getExpandedHeight() : COLLAPSED_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

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

  const zoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));

  return (
    <View className="flex-1" onLayout={onContainerLayout}>
      {/* 맵 */}
      <View className="flex-1 bg-festival-primary-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale: zoom }],
          }}
        >
          <AppText className="text-xl font-black text-white text-center">Main Map</AppText>
        </View>

        {/* 줌 컨트롤 */}
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', left: 18, bottom: 18, flexDirection: 'row', gap: 12 }}
        >
          <ZoomButton icon="add" onPress={zoomIn} disabled={zoom >= ZOOM_MAX} label="확대" />
          <ZoomButton icon="remove" onPress={zoomOut} disabled={zoom <= ZOOM_MIN} label="축소" />
        </View>
      </View>

      {/* 바텀시트 — 외곽 래퍼는 navy 로 채워 둥근 모서리 exclusion zone 으로 backdrop blob이 비치지 않게 한다. */}
      <Animated.View
        style={{
          height: sheetAnim,
          backgroundColor: '#010070',
        }}
        onLayout={onSheetLayout}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            overflow: 'hidden',
          }}
        >
          <View
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderStart={onHandleTouchStart}
            onResponderMove={onHandleTouchMove}
            onResponderRelease={onHandleTouchEnd}
            // cursor 는 web 전용 속성이라 네이티브에서는 undefined 로 스타일에서 빠진다.
            style={Platform.OS === 'web' ? ({ cursor: 'grab' } as object) : undefined}
          >
            <DragHandle />
          </View>

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
        </View>
      </Animated.View>
    </View>
  );
}

interface ZoomButtonProps {
  icon: 'add' | 'remove';
  onPress: () => void;
  disabled?: boolean;
  label: string;
}

function ZoomButton({ icon, onPress, disabled, label }: ZoomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <Ionicons name={icon} size={24} color="#010070" />
    </Pressable>
  );
}
