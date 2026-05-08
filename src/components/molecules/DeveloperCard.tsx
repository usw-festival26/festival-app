/**
 * DeveloperCard - Who We Are? 섹션 개발팀 멤버 카드 (Figma 2304:629)
 *
 * 사진(105×105 원형) + blob 카드(246×143) 가 가로로 14px 간격으로 배치.
 * side='left' = 카드 왼쪽 / 사진 오른쪽,  side='right' = 카드 오른쪽 / 사진 왼쪽.
 *
 * 카드 모서리는 사진 반대쪽이 둥글고(114px), 사진 쪽 안쪽 모서리만 10px 로 각짐.
 * Figma 의 -scale-y-100 + rotate(180) 변환을 풀어 직접 radii 로 표현.
 */
import React from 'react';
import { Image, Platform, Text, View } from 'react-native';
import type { Developer } from '../../types/information';

const PRETENDARD_BLACK = Platform.select({
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
const ROW_WIDTH = CARD_WIDTH + GAP + PHOTO_SIZE;

export interface DeveloperCardProps {
  developer: Developer;
  side: 'left' | 'right';
}

export function DeveloperCard({ developer, side }: DeveloperCardProps) {
  const cardOnLeft = side === 'left';

  // 카드 모서리 — 사진 반대쪽이 둥근 형태.
  // 카드가 왼쪽 (사진이 오른쪽) → 카드의 오른쪽 모서리 안쪽이 각짐.
  // 카드가 오른쪽 (사진이 왼쪽) → 카드의 왼쪽 모서리 안쪽이 각짐.
  const cardRadii = cardOnLeft
    ? {
        borderTopLeftRadius: 114,
        borderTopRightRadius: 71.5,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 114,
      }
    : {
        borderTopLeftRadius: 71.5,
        borderTopRightRadius: 114,
        borderBottomRightRadius: 114,
        borderBottomLeftRadius: 10,
      };

  return (
    <View
      style={{
        width: ROW_WIDTH,
        height: CARD_HEIGHT,
        flexDirection: cardOnLeft ? 'row' : 'row-reverse',
        alignItems: 'center',
        alignSelf: cardOnLeft ? 'flex-start' : 'flex-end',
        marginLeft: cardOnLeft ? 24 : 0,
        marginRight: cardOnLeft ? 0 : 24,
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
            fontFamily: PRETENDARD_BLACK,
            fontWeight: '800',
            fontSize: 20,
            lineHeight: 24,
            color: NAME_COLOR,
            textAlign: 'center',
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
  );
}
