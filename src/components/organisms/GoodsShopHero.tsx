/**
 * GoodsShopHero - 굿즈샵 메인 히어로 (Figma 2047:756 영역)
 *
 * 구성:
 *  1. "Goods List" 그라디언트 알약 (헤더와 카드 사이 띠)
 *  2. 흰색 라운드 큰 카드 (366×638) 안에:
 *     - 헤더 행: ‹ + 현재 상품명 + ›
 *     - 단일 슬라이드 카드 (292×384 GoodsCarouselCard)
 *     - 페이지네이션 텍스트 "i/N"
 *
 * carousel 인덱스는 prev/next 시 wrap-around. 빈 데이터 케이스는 안내 텍스트.
 */
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientPill } from '../atoms/GradientPill';
import { GoodsCarouselCard } from '../molecules/GoodsCarouselCard';
import { ImageLightbox } from '../molecules/ImageLightbox';
import type { GoodsItem } from '../../types/goods';

export interface GoodsShopHeroProps {
  items: GoodsItem[];
}

export function GoodsShopHero({ items }: GoodsShopHeroProps) {
  const [index, setIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<GoodsItem | null>(null);
  const total = items.length;

  if (total === 0) {
    return (
      <View
        style={{
          marginTop: 29,
          alignItems: 'center',
          paddingHorizontal: 18,
        }}
      >
        <GradientPill label="Goods List" />
        <View
          style={{
            marginTop: 51,
            width: '100%',
            maxWidth: 367,
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            paddingVertical: 80,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Pretendard-SemiBold',
              fontSize: 15,
              color: '#7D7D7D',
            }}
          >
            등록된 굿즈가 없습니다.
          </Text>
        </View>
      </View>
    );
  }

  const current = items[index];
  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <View
      style={{
        marginTop: 29,
        alignItems: 'center',
        paddingHorizontal: 18,
      }}
    >
      {/* Goods List 그라디언트 알약 — 카드 위에 살짝 떠있는 듯 배치 */}
      <GradientPill label="Goods List" />

      {/* 흰색 라운드 큰 카드 */}
      <View
        style={{
          marginTop: 22,
          width: '100%',
          maxWidth: 367,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          paddingTop: 34,
          paddingBottom: 28,
          alignItems: 'center',
        }}
      >
        {/* 헤더 — ‹ + 상품명 + › */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <Pressable
            onPress={goPrev}
            accessibilityRole="button"
            accessibilityLabel="이전 굿즈"
            hitSlop={12}
            style={{ padding: 4 }}
          >
            <Ionicons name="chevron-back" size={18} color="#000000" />
          </Pressable>
          <Text
            style={{
              fontFamily: 'Pretendard-SemiBold',
              fontSize: 15,
              color: '#000000',
              minWidth: 80,
              textAlign: 'center',
              includeFontPadding: false,
            }}
            accessibilityLiveRegion="polite"
          >
            {current.title}
          </Text>
          <Pressable
            onPress={goNext}
            accessibilityRole="button"
            accessibilityLabel="다음 굿즈"
            hitSlop={12}
            style={{ padding: 4 }}
          >
            <Ionicons name="chevron-forward" size={18} color="#000000" />
          </Pressable>
        </View>

        {/* 슬라이드 카드 — 사진 보유(images 또는 image) 면 탭 시 라이트박스 */}
        <View style={{ marginTop: 28 }}>
          <GoodsCarouselCard
            item={current}
            onPress={
              current.images?.length || current.image || current.imageUri
                ? () => setLightboxItem(current)
                : undefined
            }
          />
        </View>

        {/* 페이지네이션 */}
        <Text
          style={{
            marginTop: 33,
            fontFamily: 'Pretendard-SemiBold',
            fontSize: 15,
            color: '#000000',
            includeFontPadding: false,
          }}
          accessibilityLabel={`${index + 1}번째, 총 ${total}개`}
        >
          {`${index + 1}/${total}`}
        </Text>
      </View>

      <ImageLightbox subject={lightboxItem} onClose={() => setLightboxItem(null)} />
    </View>
  );
}
