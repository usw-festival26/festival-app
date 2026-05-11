/**
 * DeveloperCard - Who We Are? 섹션 개발팀 멤버 카드 (Figma 2304:629)
 *
 * 한 행(row) = 카드(246×143) + 사진(105×105 원형). 둘 다 row(365×143) 안의
 * absolute children — 카드는 사진 반대편 모서리 정렬, 사진은 사진 쪽 모서리에
 * vertical center 정렬. row height = CARD_HEIGHT(143) — 사진이 카드 outside 로
 * 튀어나오지 않음.
 *
 * side='left'  → 카드 left:0  / 사진 right:0
 * side='right' → 카드 right:0 / 사진 left:0
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
const ROW_GAP = 14;
const ROW_TOTAL_WIDTH = CARD_WIDTH + ROW_GAP + PHOTO_SIZE; // 365
// 사진을 row 안에서 vertical center 로 두는 좌표.
const PHOTO_TOP_CENTER = (CARD_HEIGHT - PHOTO_SIZE) / 2; // 19
// 좌·우 마진 동일 — row 자체의 left/right edge 가 모든 카드에서 일치하도록.
// 좌카드/우카드의 차이는 row 안의 카드/사진 위치만 분기 (row 의 horizontal 위치는 동일).
const SIDE_MARGIN = 20;
const ROW_FOOTPRINT = ROW_TOTAL_WIDTH + SIDE_MARGIN * 2; // 405 — 양쪽 마진 포함

export type DeveloperCardVariant = 'rounded' | 'extended';

export interface DeveloperCardProps {
  developer: Developer;
  side: 'left' | 'right';
  /** 기본 'rounded' (주호연 카드 패턴). */
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

export function DeveloperCard({ developer, side, variant = 'rounded' }: DeveloperCardProps) {
  const cardOnLeft = side === 'left';

  const { width: vw } = useWindowDimensions();
  const cardScale = vw > 0 ? Math.min(vw / ROW_FOOTPRINT, 1) : 1;
  const scaledRowWidth = ROW_TOTAL_WIDTH * cardScale;
  const scaledRowHeight = CARD_HEIGHT * cardScale;
  const scaledSideMargin = SIDE_MARGIN * cardScale;

  const cardRadii = getCardRadii(variant, cardOnLeft);

  return (
    <View
      style={{
        width: scaledRowWidth,
        height: scaledRowHeight,
        // 좌·우 마진 동일 → 모든 카드 row 의 left/right edge 일치.
        // alignSelf 제거: 좌카드/우카드 모두 동일한 horizontal 위치, 안의
        // 카드/사진만 absolute right/left 로 좌우 분기.
        marginLeft: scaledSideMargin,
        marginRight: scaledSideMargin,
      }}
    >
      {/* 내부는 unscaled 365×143 캔버스. transform: scale 로 viewport 적응. */}
      <View
        style={{
          width: ROW_TOTAL_WIDTH,
          height: CARD_HEIGHT,
          transform: [{ scale: cardScale }],
          ...(IS_WEB ? { transformOrigin: 'top left' } : null),
        }}
      >
        {/* 카드 — top:0, 사진 반대편 모서리 정렬 */}
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

        {/* 사진 — vertical center, 사진쪽 모서리(right:0 또는 left:0) 정렬.
            카드 안에 들어가서 row outside 로 튀어나오지 않음. */}
        <View
          style={{
            position: 'absolute',
            top: PHOTO_TOP_CENTER,
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
