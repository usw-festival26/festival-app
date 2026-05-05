/**
 * GoodsCarouselCard - 굿즈샵 carousel 의 단일 슬라이드 카드
 *
 * Figma 2047:759 — 292×384, 흰 배경 + 1px 검정 보더, rounded 5.
 * 이미지가 없으면 그대로 빈 카드(예: 사진 도착 전 placeholder).
 *
 * 화살표/타이틀/페이지네이션은 부모(GoodsShopHero) 영역에서 관리하므로 이 컴포넌트는
 * 단일 슬라이드 표면만 책임진다.
 */
import React from 'react';
import { View, Image } from 'react-native';
import { safeImageSource } from '@utils/imageSource';
import type { GoodsItem } from '../../types/goods';

export interface GoodsCarouselCardProps {
  item: GoodsItem;
  width?: number;
  height?: number;
}

const DEFAULT_W = 292;
const DEFAULT_H = 384;

export function GoodsCarouselCard({
  item,
  width = DEFAULT_W,
  height = DEFAULT_H,
}: GoodsCarouselCardProps) {
  const imageSource = safeImageSource(item.imageUri);
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 5,
        overflow: 'hidden',
      }}
      accessibilityLabel={`${item.title} 상품 카드`}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          accessibilityLabel={item.title}
        />
      ) : null}
    </View>
  );
}
