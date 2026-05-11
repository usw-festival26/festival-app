/**
 * FoodSheetContent — F&B 시트 (Figma 2185:1226)
 *
 * 헤더 "F&B" + 부제 + 푸드트럭 섹션 + "드링크" 통합 sub-header + 롯데칠성/주류 2단.
 * 푸드트럭/드링크 섹션 제목 아래에 짧은 가로 바 (Figma vector655/656, 57×1).
 * 푸드트럭 항목 탭 → 단일 푸드핀 좌표로 지도 줌인.
 *
 * 스타일링: NativeWind className 우선, fontFamily 만 inline (Pretendard variant 토큰
 * 별도 미정의).
 */
import React, { useMemo } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
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

/** 섹션 제목 + 그 아래 짧은 가로 바 (Figma vector655/656, 57×1). */
function SectionHeader({ title }: { title: string }) {
  return (
    <View className="items-center">
      <Text
        className="text-[17px] text-black font-bold"
        style={{ fontFamily: PRETENDARD_BOLD }}
      >
        {title}
      </Text>
      <View className="w-[57px] h-px bg-black/40 mt-[8px]" />
    </View>
  );
}

export function FoodSheetContent({
  foodPins,
  onItemPress,
}: FoodSheetContentProps) {
  const truckCoords = useMemo<MapCoords | undefined>(() => {
    return foodPins?.[0]?.coords;
  }, [foodPins]);

  const handleTruckPress = truckCoords && onItemPress ? () => onItemPress(truckCoords) : undefined;

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

      {/* 푸드트럭 섹션 */}
      <View className="mt-[30px]">
        <SectionHeader title="푸드트럭" />
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

      {/* 드링크 통합 sub-header (Figma 2603:751) — 롯데칠성 + 주류 묶음 */}
      <View className="mt-[40px]">
        <SectionHeader title="드링크" />
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
