/**
 * BoothGrid - 부스/메뉴 리스트 2컬럼 그리드 (Figma 1272:1566)
 *
 * 178×241 그라디언트 카드 2열 배치. 상단 썸네일, 하단 부스명 + 메인메뉴 2줄.
 */
import React from 'react';
import { View, Pressable, Image } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { AppText } from '@atoms/AppText';
import type { Booth } from '../../types/booth';

export interface BoothGridProps {
  booths: Booth[];
  onPressBooth?: (booth: Booth) => void;
}

const CARD_W = 178;
const CARD_H = 241;
const THUMB_W = 127;
const THUMB_H = 143;

function BoothGridCard({ booth, onPress }: { booth: Booth; onPress?: () => void }) {
  // 메인 카테고리 2개 추출, 없으면 전체에서 첫 2개
  const mainItems = booth.menuItems.filter((m) => (m.menuCategory ?? 'main') === 'main');
  const preview = (mainItems.length ? mainItems : booth.menuItems)
    .slice(0, 2)
    .map((m) => m.name)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${booth.organizer} 부스 상세 보기`}
      style={{ width: CARD_W, height: CARD_H }}
      className="active:opacity-80"
    >
      {/* 흰 세로 그라디언트 배경 (rgba 0.5 → 0.95) */}
      <Svg
        width={CARD_W}
        height={CARD_H}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Defs>
          <LinearGradient id={`booth-card-${booth.id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.95" />
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={CARD_W}
          height={CARD_H}
          rx={15}
          ry={15}
          fill={`url(#booth-card-${booth.id})`}
        />
      </Svg>

      {/* 썸네일 */}
      <View
        style={{
          position: 'absolute',
          top: 22,
          left: 25,
          width: THUMB_W,
          height: THUMB_H,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: '#F0F0F0',
        }}
      >
        {booth.imageUri ? (
          <Image
            source={{ uri: booth.imageUri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : null}
      </View>

      {/* 부스명 (Pretendard SemiBold 15 #02015b) */}
      <AppText
        style={{
          position: 'absolute',
          left: 26,
          top: 177,
          fontFamily: 'Pretendard-SemiBold',
          fontSize: 15,
          color: '#02015B',
        }}
      >
        {booth.organizer}
      </AppText>

      {/* 메인메뉴 라벨 + 프리뷰 (Pretendard Regular 12 #7C7C97) */}
      <View style={{ position: 'absolute', left: 26, top: 200 }}>
        <AppText
          style={{
            fontFamily: 'Pretendard-Regular',
            fontSize: 12,
            color: '#7C7C97',
            lineHeight: 16,
          }}
        >
          메인메뉴
        </AppText>
        {preview ? (
          <AppText
            numberOfLines={1}
            style={{
              fontFamily: 'Pretendard-Regular',
              fontSize: 12,
              color: '#7C7C97',
              lineHeight: 16,
            }}
          >
            {preview}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

export function BoothGrid({ booths, onPressBooth }: BoothGridProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 34,
        rowGap: 17,
      }}
    >
      {booths.map((b) => (
        <BoothGridCard key={b.id} booth={b} onPress={() => onPressBooth?.(b)} />
      ))}
    </View>
  );
}
