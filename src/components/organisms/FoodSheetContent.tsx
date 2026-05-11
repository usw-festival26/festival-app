/**
 * FoodSheetContent — F&B 시트 (Figma 2185:1226)
 *
 * 헤더 "F&B" + 부제 + 푸드트럭 15개 2단 불릿 리스트 + 롯데칠성 7개 + 주류 3개.
 * 푸드트럭 항목 탭 → 단일 푸드핀 좌표로 지도 줌인. 음료/주류는 비인터랙티브.
 */
import React, { useMemo } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { FOOD_TRUCK_VENDORS, LOTTE_DRINKS, ALCOHOLS } from '@data/foodFnb';
import type { FoodPin } from '../../types/cluster';
import type { MapCoords } from '../../types/map';

const ROBOTO_BLACK = Platform.select({ web: 'Roboto, sans-serif', default: 'Roboto-Black' });
const PRETENDARD_BOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Bold' });
const PRETENDARD_MEDIUM = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Medium' });
const PRETENDARD_LIGHT = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Light' });

const FOOD_TRUCKS_LEFT = FOOD_TRUCK_VENDORS.slice(0, 8);
const FOOD_TRUCKS_RIGHT = FOOD_TRUCK_VENDORS.slice(8);

export interface FoodSheetContentProps {
  /** 단일 푸드 핀 — 푸드트럭 항목 탭 시 이 좌표로 줌인. */
  foodPins?: FoodPin[];
  onItemPress?: (coords: MapCoords) => void;
}

interface BulletProps {
  label: string;
  onPress?: () => void;
}

function Bullet({ label, onPress }: BulletProps) {
  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6 }}>
      <Text
        style={{
          fontFamily: PRETENDARD_MEDIUM,
          fontSize: 15,
          color: '#000',
          lineHeight: 20,
          width: 14,
          textAlign: 'center',
        }}
      >
        •
      </Text>
      <Text
        style={{
          fontFamily: PRETENDARD_MEDIUM,
          fontSize: 15,
          color: '#000',
          lineHeight: 20,
          flex: 1,
        }}
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

export function FoodSheetContent({ foodPins, onItemPress }: FoodSheetContentProps) {
  const truckCoords = useMemo<MapCoords | undefined>(() => {
    return foodPins?.[0]?.coords;
  }, [foodPins]);

  const handleTruckPress = truckCoords && onItemPress ? () => onItemPress(truckCoords) : undefined;

  return (
    <View>
      <View style={{ alignItems: 'center', paddingTop: 28 }}>
        <Text
          style={{
            fontFamily: ROBOTO_BLACK,
            fontSize: 20,
            fontWeight: '900',
            color: '#000',
            textAlign: 'center',
          }}
        >
          F&B
        </Text>
        <Text
          style={{
            fontFamily: PRETENDARD_LIGHT,
            fontSize: 14,
            color: '#002466',
            marginTop: 14,
            fontWeight: '300',
          }}
        >
          푸드트럭 메뉴는 변동사항이 있을 수 있습니다!
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text
          style={{
            fontFamily: PRETENDARD_BOLD,
            fontSize: 17,
            color: '#000',
            fontWeight: '700',
          }}
        >
          푸드트럭
        </Text>
      </View>
      <View
        style={{
          marginTop: 14,
          paddingHorizontal: 24,
          flexDirection: 'row',
          position: 'relative',
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {FOOD_TRUCKS_LEFT.map((name) => (
            <Bullet key={name} label={name} onPress={handleTruckPress} />
          ))}
        </View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: 1,
            backgroundColor: '#000',
            opacity: 0.2,
          }}
        />
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {FOOD_TRUCKS_RIGHT.map((name) => (
            <Bullet key={name} label={name} onPress={handleTruckPress} />
          ))}
        </View>
      </View>

      <View
        style={{
          marginTop: 36,
          paddingHorizontal: 24,
          flexDirection: 'row',
          position: 'relative',
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Text
            style={{
              fontFamily: PRETENDARD_BOLD,
              fontSize: 17,
              color: '#000',
              fontWeight: '700',
              marginBottom: 10,
            }}
          >
            롯데칠성
          </Text>
          {LOTTE_DRINKS.map((name) => (
            <Bullet key={name} label={name} />
          ))}
        </View>
        <View
          style={{
            position: 'absolute',
            top: 30,
            bottom: 0,
            left: '50%',
            width: 1,
            backgroundColor: '#000',
            opacity: 0.2,
          }}
        />
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Text
            style={{
              fontFamily: PRETENDARD_BOLD,
              fontSize: 17,
              color: '#000',
              fontWeight: '700',
              marginBottom: 10,
            }}
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
