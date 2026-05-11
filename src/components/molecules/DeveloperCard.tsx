/**
 * DeveloperCard - Who We Are? 섹션 개발팀 멤버 카드 (Figma 2304:629)
 *
 * 한 행 (row) = 카드(246×143) + 사진(105×105 원형). 사진은 카드 bottom 보다
 * 24px 아래로 튀어나오는 디자인 (Figma photo top:62 from card top, photo height
 * 105 → photo bottom 167, card height 143 → 차 24).
 *
 * row height = 167 (카드 143 + photo overflow 24).
 * side='left'  → 카드 왼쪽 / 사진 오른쪽
 * side='right' → 카드 오른쪽 / 사진 왼쪽 (mirror)
 *
 * 곡률 variant:
 *  - 'rounded'  → 71.5 / 71.5 / 10 / 71.5  (카드 1·2 패턴)
 *  - 'extended' → 114  / 71.5 / 10 / 114   (카드 3~7 패턴)
 *  사진 쪽 안쪽 모서리만 10 으로 각짐.
 *
 * viewport 가 행 footprint(385) 보다 작으면 비례 축소. SSR/static 첫 렌더 vw=0
 * 가드 (fallback 1) 로 invisible 회귀 방지.
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
const PHOTO_TOP = 62; // Figma: photo top - card top
const ROW_WIDTH = CARD_WIDTH + PHOTO_SIZE; // 351 — gap 은 카드/사진 모두 row 가장자리 정렬, 가운데 빈 공간이 자동 생김 (Figma 와 동일)
// Figma 카드 left 20 + width 246 → end 266. photo left 280 → gap 14 (266→280). row width = 365 (사진 right 385 - 카드 left 20).
const ROW_GAP = 14;
const ROW_TOTAL_WIDTH = CARD_WIDTH + ROW_GAP + PHOTO_SIZE; // 365
const ROW_HEIGHT = PHOTO_TOP + PHOTO_SIZE; // 167 — 카드 143 보다 24 큼 (사진 overflow)
const SIDE_MARGIN_LEFT = 20;
const SIDE_MARGIN_RIGHT = 17;
const ROW_FOOTPRINT = ROW_TOTAL_WIDTH + Math.max(SIDE_MARGIN_LEFT, SIDE_MARGIN_RIGHT); // 385

export type DeveloperCardVariant = 'rounded' | 'extended';

export interface DeveloperCardProps {
  developer: Developer;
  side: 'left' | 'right';
  /** 기본 'extended'. Figma 카드 1·2(주호연·남주연) 만 'rounded'. */
  variant?: DeveloperCardVariant;
}

function getCardRadii(variant: DeveloperCardVariant, cardOnLeft: boolean) {
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

  const { width: vw } = useWindowDimensions();
  const cardScale = vw > 0 ? Math.min(vw / ROW_FOOTPRINT, 1) : 1;
  const scaledRowWidth = ROW_TOTAL_WIDTH * cardScale;
  const scaledRowHeight = ROW_HEIGHT * cardScale;
  const scaledMarginLeft = (cardOnLeft ? SIDE_MARGIN_LEFT : 0) * cardScale;
  const scaledMarginRight = (cardOnLeft ? 0 : SIDE_MARGIN_RIGHT) * cardScale;

  const cardRadii = getCardRadii(variant, cardOnLeft);

  return (
    <View
      style={{
        width: scaledRowWidth,
        height: scaledRowHeight,
        alignSelf: cardOnLeft ? 'flex-start' : 'flex-end',
        marginLeft: scaledMarginLeft,
        marginRight: scaledMarginRight,
      }}
    >
      {/* 내부는 unscaled 365×167 캔버스. transform: scale 로 viewport 적응. */}
      <View
        style={{
          width: ROW_TOTAL_WIDTH,
          height: ROW_HEIGHT,
          transform: [{ scale: cardScale }],
          ...(IS_WEB ? { transformOrigin: 'top left' } : null),
        }}
      >
        {/* 카드 — top:0, 사진 반대편에 정렬 */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            ...(cardOnLeft ? { left: 0 } : { right: 0 }),
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

        {/* 사진 — top:62, 사진 위치 (카드 반대편), 카드 bottom 보다 24 아래로 overflow */}
        <View
          style={{
            position: 'absolute',
            top: PHOTO_TOP,
            ...(cardOnLeft ? { right: 0 } : { left: 0 }),
            width: PHOTO_SIZE,
            height: PHOTO_SIZE,
            borderRadius: PHOTO_SIZE / 2,
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
          }}
        >
          <Image
            source={developer.image}
            accessibilityLabel={`${developer.name} 프로필 사진`}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
}
