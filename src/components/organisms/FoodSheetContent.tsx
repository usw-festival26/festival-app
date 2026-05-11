/**
 * FoodSheetContent — F&B 시트 (Figma 2185:1226)
 *
 * 헤더 "F&B" + 부제 + 푸드트럭 15개 2단 + (NEW) "드링크" 통합 sub-header +
 * 롯데칠성 7개 + 주류 3개 2단.
 *
 * 푸드트럭 항목 탭 → 단일 푸드핀 좌표로 지도 줌인.
 * 푸드트럭 헤더 옆 "드링크 ↓" quick link → 부모 ScrollView 가 드링크 섹션으로 자동 스크롤.
 *
 * 스타일링: NativeWind className 우선, fontFamily 만 inline (NativeWind tailwind
 * config 에 Pretendard variant 토큰이 별도로 없어 platform-specific 폰트 이름 inline).
 */
import React, { useMemo } from 'react';
import { View, Text, Pressable, Platform, type LayoutChangeEvent } from 'react-native';
import { FOOD_TRUCK_VENDORS, LOTTE_DRINKS, ALCOHOLS } from '@data';
import type { FoodSheetContentProps, BulletProps, MapCoords } from '@types';

const ROBOTO_BLACK = Platform.select({ web: 'Roboto, sans-serif', default: 'Roboto-Black' });
const PRETENDARD_BOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Bold' });
const PRETENDARD_MEDIUM = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Medium' });
const PRETENDARD_LIGHT = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Light' });

const FOOD_TRUCKS_LEFT = FOOD_TRUCK_VENDORS.slice(0, 8);
const FOOD_TRUCKS_RIGHT = FOOD_TRUCK_VENDORS.slice(8);

function Bullet({ label, onPress }: BulletProps) {
  const content = (
    <View className="flex-row items-start py-[6px]">
      <Text
        className="text-[15px] text-black text-center font-medium leading-5 w-[14px]"
        style={{ fontFamily: PRETENDARD_MEDIUM }}
      >
        •
      </Text>
      <Text
        className="text-[15px] text-black flex-1 font-medium leading-5"
        style={{ fontFamily: PRETENDARD_MEDIUM }}
      >
        {label}
      </Text>
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label} 위치 보기`}>
      {content}
    </Pressable>
  );
}

export function FoodSheetContent({
  foodPins,
  onItemPress,
  onDrinkLayout,
  onScrollToDrink,
}: FoodSheetContentProps) {
  const truckCoords = useMemo<MapCoords | undefined>(() => {
    return foodPins?.[0]?.coords;
  }, [foodPins]);

  const handleTruckPress = truckCoords && onItemPress ? () => onItemPress(truckCoords) : undefined;

  const handleDrinkSectionLayout = (e: LayoutChangeEvent) => {
    onDrinkLayout?.(e.nativeEvent.layout.y);
  };

  return (
    <View>
      <View className="items-center pt-[28px]">
        <Text
          className="text-[20px] text-black text-center font-black"
          style={{ fontFamily: ROBOTO_BLACK }}
        >
          F&B
        </Text>
        <Text
          className="text-[14px] text-[#002466] mt-[14px] font-light"
          style={{ fontFamily: PRETENDARD_LIGHT }}
        >
          푸드트럭 메뉴는 변동사항이 있을 수 있습니다!
        </Text>
      </View>

      {/* 푸드트럭 헤더 — 가운데 "푸드트럭" + 우측 "드링크 ↓" quick scroll link.
          quick link 누르면 부모 ScrollView 가 드링크 섹션 y 로 scroll. */}
      <View className="mt-[30px] px-[24px] flex-row items-center justify-center">
        <Text
          className="text-[17px] text-black font-bold"
          style={{ fontFamily: PRETENDARD_BOLD }}
        >
          푸드트럭
        </Text>
        {onScrollToDrink ? (
          <Pressable
            onPress={onScrollToDrink}
            accessibilityRole="button"
            accessibilityLabel="드링크 섹션으로 이동"
            className="absolute right-[24px] py-[4px] px-[10px] active:opacity-60"
          >
            <Text
              className="text-[13px] text-[#002466] font-medium"
              style={{ fontFamily: PRETENDARD_MEDIUM }}
            >
              드링크 ↓
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View className="mt-[14px] px-[24px] flex-row relative">
        <View className="flex-1 px-[16px]">
          {FOOD_TRUCKS_LEFT.map((name) => (
            <Bullet key={name} label={name} onPress={handleTruckPress} />
          ))}
        </View>
        <View className="absolute top-0 bottom-0 left-1/2 w-px bg-black/20" />
        <View className="flex-1 px-[16px]">
          {FOOD_TRUCKS_RIGHT.map((name) => (
            <Bullet key={name} label={name} onPress={handleTruckPress} />
          ))}
        </View>
      </View>

      {/* 드링크 통합 sub-header (Figma 2603:751, top:909). 롯데칠성 + 주류 묶음.
          이 View 의 onLayout 으로 y 좌표를 부모에 알려줌 → quick link scroll 타깃. */}
      <View
        className="items-center mt-[40px]"
        onLayout={handleDrinkSectionLayout}
      >
        <Text
          className="text-[17px] text-black font-bold"
          style={{ fontFamily: PRETENDARD_BOLD }}
        >
          드링크
        </Text>
      </View>

      <View className="mt-[14px] px-[24px] flex-row relative">
        <View className="flex-1 px-[16px]">
          <Text
            className="text-[17px] text-black font-bold mb-[10px]"
            style={{ fontFamily: PRETENDARD_BOLD }}
          >
            롯데칠성
          </Text>
          {LOTTE_DRINKS.map((name) => (
            <Bullet key={name} label={name} />
          ))}
        </View>
        <View className="absolute top-[30px] bottom-0 left-1/2 w-px bg-black/20" />
        <View className="flex-1 px-[16px]">
          <Text
            className="text-[17px] text-black font-bold mb-[10px]"
            style={{ fontFamily: PRETENDARD_BOLD }}
          >
            주류
          </Text>
          {ALCOHOLS.map((name) => (
            <Bullet key={name} label={name} />
          ))}
        </View>
      </View>
    </View>
  );
}
