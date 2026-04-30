/**
 * BoothMapView - 지도 화면의 organism: MapCanvas + 드래그 가능한 바텀시트.
 *
 * Figma 82:62 ~ 166:472, 920:3931, 1413:1008.
 * 카테고리 칩은 헤더(ScreenHeader subHeader)에서 담당. 이 컴포넌트는 맵+시트만.
 *
 * expanded / activeCategory 분리:
 * - expanded: 시트가 펼쳐졌는지
 * - activeCategory: 현재 표시 중인 카테고리 (시트 접어도 유지)
 *
 * 맵 자체(이미지/팬/줌/핀 렌더)는 MapCanvas 가 담당. 줌 +/− 버튼은 캔버스 빌트인.
 */
import { DragHandle } from '@atoms/DragHandle';
import { MapCanvas, type AnyPin } from '@organisms/MapCanvas';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import type { Booth } from '../../types/booth';
import type { BoothCluster, FacilityPin, FoodPin, PinCategory } from '../../types/cluster';
import type { Facility, FestivalEvent, SheetCategory } from '../../types/map';
import { BoothSheetContent } from './BoothSheetContent';
import { EventSheetContent } from './EventSheetContent';
import { FacilitySheetContent } from './FacilitySheetContent';
import { FoodSheetContent } from './FoodSheetContent';

const FESTIVAL_MAP = require('../../../assets/images/festivalmap.jpg');
const MAP_NATURAL_WIDTH = 1097;
const MAP_NATURAL_HEIGHT = 1462;

export interface BoothMapViewProps {
  expanded: boolean;
  activeCategory: SheetCategory;
  booths: Booth[];
  foodBooths: Booth[];
  facilities: Facility[];
  events: FestivalEvent[];
  /** 단과대 그룹 핀 */
  clusters: BoothCluster[];
  /** 푸드 핀 */
  foodPins: FoodPin[];
  /** 편의시설 핀 */
  facilityPins: FacilityPin[];
  /** 핀 카테고리 필터 — 'all' / cluster / food / facility */
  pinFilter?: 'all' | PinCategory;
  /** 핀 클릭 핸들러 (cluster/food/facility 분기) */
  onPinPress?: (pin: AnyPin) => void;
  /** 클러스터 핀으로 부스 시트가 필터링됐을 때 표시할 단과대명. 있으면 시트 상단에 노출. */
  selectedClusterName?: string;
  /** 클러스터 필터 해제 콜백 — 시트 상단 "전체 보기" 버튼 등에서 사용 */
  onClearClusterFilter?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
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
  clusters,
  foodPins,
  facilityPins,
  pinFilter,
  onPinPress,
  selectedClusterName,
  onClearClusterFilter,
  isLoading,
  error,
  onRetry,
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

  // 핀 라벨 lookup — booth/foodBooth 합쳐서 id → Booth, facility id → Facility
  const boothById = useMemo(() => {
    const merged = [...booths, ...foodBooths];
    return new Map(merged.map((b) => [b.id, b]));
  }, [booths, foodBooths]);

  const facilityById = useMemo(
    () => new Map(facilities.map((f) => [f.id, f])),
    [facilities],
  );

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

  return (
    <View className="flex-1" onLayout={onContainerLayout}>
      {/* 맵 캔버스 (이미지 + 핀 + 팬/줌) */}
      <MapCanvas
        imgSource={FESTIVAL_MAP}
        imgNaturalWidth={MAP_NATURAL_WIDTH}
        imgNaturalHeight={MAP_NATURAL_HEIGHT}
        clusters={clusters}
        foodPins={foodPins}
        facilityPins={facilityPins}
        pinFilter={pinFilter}
        boothById={boothById}
        facilityById={facilityById}
        onPinPress={onPinPress}
      />

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
                    <BoothSheetContent
                      booths={booths}
                      isLoading={isLoading}
                      error={error}
                      onRetry={onRetry}
                      filterLabel={selectedClusterName}
                      onClearFilter={onClearClusterFilter}
                    />
                    <View className="h-6" />
                  </ScrollView>
                </View>

                <View style={{ width: sheetWidth, flex: 1 }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <FoodSheetContent booths={foodBooths} isLoading={isLoading} error={error} onRetry={onRetry} />
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
