/**
 * DeveloperCard - Who We Are? 섹션 개발팀 멤버 카드 (Figma 2304:629)
 *
 * 사진(105×105 원형) + 흰색 blob 카드(246×143) 가 14px gap 으로 한 행.
 * side='left'  → 카드 왼쪽 / 사진 오른쪽 (행 시작 left:20)
 * side='right' → 카드 오른쪽 / 사진 왼쪽 (행 끝 right:17)
 *
 * 곡률 variant 두 가지 (Figma 디자인 그대로):
 *  - 'rounded'  → 71.5 / 71.5 / 10 / 71.5  (카드 1·2 패턴, 부드러운 알약형)
 *  - 'extended' → 114  / 71.5 / 10 / 114   (카드 3~7 패턴, 사진 반대편이 더 큰 호)
 *  사진 쪽 안쪽 모서리만 10 으로 각짐 — 사진과 만나는 부분은 직선처럼.
 *
 * viewport 가 행 footprint(365+여백) 보다 작으면 비례 축소. SSR/static 첫 렌더
 * vw=0 가드 (fallback 1) 로 invisible 회귀 방지.
 */
import React from 'react';
import { Image, Platform, Text, View, useWindowDimensions } from 'react-native';
import type { Developer } from '@types';

const IS_WEB = Platform.OS === 'web';

const PRETENDARD_EXTRABOLD = Platform.select({
  web: 'Pretendard Variable',
  default: 'Pretendard-Black',
});
const PRETENDARD_SEMIBOLD = Platform.select({
  web: 'Pretendard Variable',
  default: 'Pretendard-SemiBold',
});
const PRETENDARD_REGULAR = Platform.select({
  web: 'Pretendard Variable',
  default: 'Pretendard-Regular',
});

const NAME_COLOR = '#001E56';
const ROLE_COLOR = '#004466';

const CARD_WIDTH = 246;
const CARD_HEIGHT = 143;
const PHOTO_SIZE = 105;
const GAP = 14;
const ROW_WIDTH = CARD_WIDTH + GAP + PHOTO_SIZE; // 365
const SIDE_MARGIN = 20; // Figma 좌카드 marginLeft 20 / 우카드 marginRight ~17
const ROW_FOOTPRINT = ROW_WIDTH + SIDE_MARGIN; // 385

export type DeveloperCardVariant = 'rounded' | 'extended';

export interface DeveloperCardProps {
  developer: Developer;
  side: 'left' | 'right';
  /** 기본 'extended'. 카드 1·2(주호연·남주연) 만 'rounded'. */
  variant?: DeveloperCardVariant;
}

function getCardRadii(variant: DeveloperCardVariant, cardOnLeft: boolean) {
  // 사진 반대편의 곡률 크기. extended 가 더 큰 호.
  const big = variant === 'extended' ? 114 : 71.5;
  const sm = 71.5;
  if (cardOnLeft) {
    // 사진이 오른쪽. 카드의 왼쪽(사진 반대편) 모서리 둘 다 big, 사진쪽 위만 sm, 아래는 각짐 10.
    return {
      borderTopLeftRadius: big,
      borderTopRightRadius: sm,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: big,
    };
  }
  // 사진이 왼쪽. 카드의 오른쪽(사진 반대편) 모서리 둘 다 big, 사진쪽 위만 sm, 아래는 각짐 10.
  return {
    borderTopLeftRadius: sm,
    borderTopRightRadius: big,
    borderBottomRightRadius: big,
    borderBottomLeftRadius: 10,
  };
}

export function DeveloperCard({ developer, side, variant = 'extended' }: DeveloperCardProps) {
  const cardOnLeft = side === 'left';

  // viewport-adaptive scale — vw 가 ROW_FOOTPRINT(385) 보다 작으면 비례 축소.
  // SSR/첫 paint 시 vw=0 → fallback 1 로 invisible 회피.
  const { width: vw } = useWindowDimensions();
  const cardScale = vw > 0 ? Math.min(vw / ROW_FOOTPRINT, 1) : 1;
  const scaledRowWidth = ROW_WIDTH * cardScale;
  const scaledRowHeight = CARD_HEIGHT * cardScale;
  const scaledSideMargin = SIDE_MARGIN * cardScale;

  const cardRadii = getCardRadii(variant, cardOnLeft);

  return (
    <View
      style={{
        width: scaledRowWidth,
        height: scaledRowHeight,
        alignSelf: cardOnLeft ? 'flex-start' : 'flex-end',
        marginLeft: cardOnLeft ? scaledSideMargin : 0,
        marginRight: cardOnLeft ? 0 : scaledSideMargin - 3, // Figma 의 우카드 marginRight 17
      }}
    >
      <View
        style={{
          width: ROW_WIDTH,
          height: CARD_HEIGHT,
          flexDirection: cardOnLeft ? 'row' : 'row-reverse',
          alignItems: 'center',
          transform: [{ scale: cardScale }],
          ...(IS_WEB ? { transformOrigin: 'top left' } : null),
        }}
      >
        <View
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            backgroundColor: '#FFFFFF',
            ...cardRadii,
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontFamily: PRETENDARD_EXTRABOLD,
              fontWeight: '900',
              fontSize: 20,
              lineHeight: 24,
              color: NAME_COLOR,
              textAlign: 'center',
              letterSpacing: -0.3,
            }}
          >
            {developer.name}
          </Text>
          <Text
            style={{
              fontFamily: PRETENDARD_SEMIBOLD,
              fontWeight: '600',
              fontSize: 15,
              lineHeight: 20,
              color: ROLE_COLOR,
              textAlign: 'center',
              marginTop: 8,
              letterSpacing: -0.3,
            }}
          >
            {developer.role}
          </Text>
          <Text
            style={{
              fontFamily: PRETENDARD_REGULAR,
              fontSize: 12,
              lineHeight: 16,
              color: NAME_COLOR,
              textAlign: 'center',
              marginTop: 4,
              letterSpacing: -0.3,
            }}
          >
            {developer.college}
          </Text>
        </View>
        <View style={{ width: GAP }} />
        <Image
          source={developer.image}
          accessibilityLabel={`${developer.name} 프로필 사진`}
          style={{
            width: PHOTO_SIZE,
            height: PHOTO_SIZE,
            borderRadius: PHOTO_SIZE / 2,
            backgroundColor: '#FFFFFF',
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}
