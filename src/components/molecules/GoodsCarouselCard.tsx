/**
 * GoodsCarouselCard - 굿즈샵 carousel 의 단일 슬라이드 카드
 *
 * Figma 2047:759 — 292×384, 흰 배경 + 1px 검정 보더, rounded 5.
 * 이미지가 없으면 그대로 빈 카드(예: 사진 도착 전 placeholder).
 *
 * 화살표/타이틀/페이지네이션은 부모(GoodsShopHero) 영역에서 관리하므로 이 컴포넌트는
 * 단일 슬라이드 표면만 책임진다. onPress 가 있을 때만 Pressable 이라 시각적 변화
 * 최소화 (보더/배경 그대로).
 */
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { safeImageSource } from '@utils/imageSource';
import type { GoodsItem } from '../../types/goods';

export interface GoodsCarouselCardProps {
  item: GoodsItem;
  width?: number;
  height?: number;
  /** 카드 탭 핸들러 — 보통 라이트박스 모달 열기. 없으면 정적 카드. */
  onPress?: () => void;
}

const DEFAULT_W = 292;
const DEFAULT_H = 384;

export function GoodsCarouselCard({
  item,
  width = DEFAULT_W,
  height = DEFAULT_H,
  onPress,
}: GoodsCarouselCardProps) {
  const remoteSrc = safeImageSource(item.imageUri);
  const imageSource = item.image ?? item.images?.[0] ?? remoteSrc ?? null;

  const cardStyle = {
    width,
    height,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    overflow: 'hidden' as const,
  };

  const inner = imageSource ? (
    <Image
      source={imageSource}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
      accessibilityLabel={item.title}
    />
  ) : null;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${item.title} 사진 자세히 보기`}
        style={({ pressed }) => ({ ...cardStyle, opacity: pressed ? 0.85 : 1 })}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} accessibilityLabel={`${item.title} 상품 카드`}>
      {inner}
    </View>
  );
}
