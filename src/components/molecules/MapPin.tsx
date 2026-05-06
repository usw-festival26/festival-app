/**
 * MapPin - 지도 위 핀포인트 (Figma 2096:801).
 *
 * 마커(티어드롭)는 디자이너가 export 한 PNG 를 그대로 사용
 * (`assets/images/pins/{빨강|초록|파랑} 핀 아이콘.png`).
 * 말풍선은 react-native-svg 로 인라인 렌더 — Figma export SVG 가 `<filter>`,
 * `<mask>` 를 포함해 react-native-svg-transformer 가 변환에 실패하기 때문.
 *
 * 구조 (위에서부터):
 *           ⬤        마커 (PNG, 카테고리별 이미지)
 *                    ↕ MARKER_GAP
 *   ┌──────────────┐
 *   │  Title       │  말풍선 (옅은 파스텔 + 흰색 stroke)
 *   │  Subtitle    │
 *   │       더보기› │
 *   └──────▽──────┘  말풍선 tail (아래 방향, anchor)
 *
 * labelLines 슬롯
 * - cluster: [name, members, '더보기 >']
 * - food:    [name]
 * - facility:[name(, phone)]
 *
 * anchor: 말풍선 tail 끝.
 */
import React from 'react';
import { Image, Platform, Pressable, Text, View, type ImageSourcePropType } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { PinCategory } from '../../types/cluster';

/**
 * 핀 전체 비례 — 1.0 = Figma 원본 (마커 37×40, 말풍선 146×121).
 * 마커 PNG 와 말풍선 SVG 는 viewBox/원본 비율 그대로, 렌더 width/height 만 줄여
 * 마커·말풍선·텍스트가 동시에 따라간다. 이 값만 만지면 전체 사이즈 조절.
 */
const PIN_SCALE = 0.60;

// === 마커 원본 비율 (PNG) ===
const MARKER_VB_W = 37;
const MARKER_VB_H = 40;
const MARKER_VB_VISIBLE_BOTTOM = 32; // 티어드롭 tail tip y (그림자 제외)

const MARKER_SOURCE: Record<PinCategory, ImageSourcePropType> = {
  cluster: require('../../../assets/images/pins/파랑 핀 아이콘.png'),
  food: require('../../../assets/images/pins/빨강 핀 아이콘.png'),
  facility: require('../../../assets/images/pins/초록 핀 아이콘.png'),
};

// === 말풍선 viewBox ===
// 원본(Figma) body 106.481 에서 88 로 축소 (텍스트 양 대비 위/아래 여백이 과해서).
// 너비/둥근 corner radius(20)/tail 모양은 그대로 유지하고 직선 구간 길이만 단축.
//   원본 straight middle: y 20~86.4814  →  새: y 20~68
//   원본 bottom corner end: y 106.481   →  새: y 88
//   원본 tail tip control y: 121.297    →  새: 88 + (121.297-106.481) = 102.816
const BUBBLE_VB_W = 146;
const BUBBLE_VB_H = 103;
const BUBBLE_VB_BODY_H = 88;
const BUBBLE_VB_TAIL_TIP_Y = 102.816;
const BUBBLE_PATH =
  'M 126 0 C 137.046 0 146 8.9543 146 20 V 68 C 146 79.046 137.046 88 126 88 H 82.9639 L 76.9062 99.299 C 75.0209 102.816 69.9791 102.816 68.0938 99.299 L 62.0361 88 H 20 C 8.9544 88 0.0002 79.046 0 68 V 20 C 0 8.9543 8.9543 0 20 0 H 126 Z';

const BUBBLE_FILL: Record<PinCategory, string> = {
  cluster: '#FEF2FF', // 파랑핀.svg
  food: '#FFE5E5', // 빨강핀.svg
  facility: '#EBFFF3', // 초록 핀.svg
};

// === 렌더 치수 (PIN_SCALE 적용) ===
const MARKER_W = MARKER_VB_W * PIN_SCALE;
const MARKER_H = MARKER_VB_H * PIN_SCALE;
const MARKER_VISIBLE_BOTTOM = MARKER_VB_VISIBLE_BOTTOM * PIN_SCALE;
const BUBBLE_W = BUBBLE_VB_W * PIN_SCALE;
const BUBBLE_H = BUBBLE_VB_H * PIN_SCALE;
const BUBBLE_BODY_H = BUBBLE_VB_BODY_H * PIN_SCALE;
const BUBBLE_TAIL_TIP_X = BUBBLE_W / 2;
const BUBBLE_TAIL_TIP_Y = BUBBLE_VB_TAIL_TIP_Y * PIN_SCALE;
const MARKER_GAP = 8 * PIN_SCALE;
const PIN_WIDTH = BUBBLE_W;
const TOTAL_HEIGHT = MARKER_VISIBLE_BOTTOM + MARKER_GAP + BUBBLE_H;

// === 텍스트 (PIN_SCALE 적용) ===
const TITLE_FONT = 15 * PIN_SCALE;
const TITLE_LH = 18 * PIN_SCALE;
const SUB_FONT = 12 * PIN_SCALE;
const SUB_LH = 14 * PIN_SCALE;
const SUB_MARGIN_TOP = 6 * PIN_SCALE;
const TEXT_PAD_H = 16 * PIN_SCALE;
const TEXT_PAD_V = 14 * PIN_SCALE;

const PRETENDARD_SEMIBOLD = Platform.select({
  web: 'Pretendard Variable',
  default: 'Pretendard-SemiBold',
});
const PRETENDARD_REGULAR = Platform.select({
  web: 'Pretendard Variable',
  default: 'Pretendard-Regular',
});

export interface MapPinProps {
  category: PinCategory;
  /**
   * 1~3줄 라벨. cluster: [단과대명, 멤버이름들, '더보기 >']
   * food: [부스명] 또는 [부스명, 설명]
   * facility: [시설명, 전화번호]
   */
  labelLines: string[];
  onPress?: () => void;
  /** 에디터에서 선택된 핀 강조 — 살짝 확대 */
  selected?: boolean;
}

export function MapPin({ category, labelLines, onPress, selected }: MapPinProps) {
  const bubbleFill = BUBBLE_FILL[category];

  const lines = labelLines.slice(0, 3);
  const moreIdx = lines.findIndex((l) => l.trim().startsWith('더보기'));
  const moreLine = moreIdx >= 0 ? lines[moreIdx] : null;
  const otherLines = moreIdx >= 0 ? lines.slice(0, moreIdx) : lines;
  const title = otherLines[0];
  const subtitle = otherLines[1];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={lines.join(' ')}
      style={{
        width: PIN_WIDTH,
        height: TOTAL_HEIGHT,
        transform: selected ? [{ scale: 1.08 }] : undefined,
      }}
    >
      {/* 마커 (상단 가운데) — PNG */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: (PIN_WIDTH - MARKER_W) / 2,
          width: MARKER_W,
          height: MARKER_H,
          // RN shadow (iOS) + elevation (Android) — Figma 의 filter dropShadow 대체
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        <Image
          source={MARKER_SOURCE[category]}
          style={{ width: MARKER_W, height: MARKER_H }}
          resizeMode="contain"
        />
      </View>

      {/* 말풍선 + 텍스트 */}
      <View
        style={{
          position: 'absolute',
          top: MARKER_VISIBLE_BOTTOM + MARKER_GAP,
          left: 0,
          width: BUBBLE_W,
          height: BUBBLE_H,
        }}
      >
        <Svg width={BUBBLE_W} height={BUBBLE_H} viewBox={`0 0 ${BUBBLE_VB_W} ${BUBBLE_VB_H}`}>
          <Path d={BUBBLE_PATH} fill={bubbleFill} stroke="#FFFFFF" strokeWidth={1} />
        </Svg>

        {/* 텍스트 오버레이 — 본문 영역 (tail 제외) */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: BUBBLE_W,
            height: BUBBLE_BODY_H,
            paddingHorizontal: TEXT_PAD_H,
            paddingVertical: TEXT_PAD_V,
          }}
        >
          {/* 제목 + 부제 — 말풍선 정중앙 정렬.
              더보기는 absolute 로 빼서 column flex 에서 분리(아래 참조).
              alignSelf 'stretch' + Text width 100% 는 RN Web 에서 alignItems:center
              + numberOfLines 조합 시 폭 측정 collapse 방어. */}
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {title ? (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  width: '100%',
                  fontFamily: PRETENDARD_SEMIBOLD,
                  fontWeight: '600',
                  fontSize: TITLE_FONT,
                  lineHeight: TITLE_LH,
                  color: '#000000',
                  textAlign: 'center',
                }}
              >
                {title}
              </Text>
            ) : null}
            {subtitle ? (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  width: '100%',
                  fontFamily: PRETENDARD_REGULAR,
                  fontWeight: '400',
                  fontSize: SUB_FONT,
                  lineHeight: SUB_LH,
                  color: '#000000',
                  textAlign: 'center',
                  marginTop: SUB_MARGIN_TOP,
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* 더보기 — 우하단 absolute. flex 흐름 밖으로 빼야 title 이 부모 height
              전체에서 정중앙 정렬을 유지한다 (이전엔 더보기가 flex:1 로 남은
              공간을 가져가서 title 이 위쪽으로 밀려 보였음). */}
          {moreLine ? (
            <Text
              numberOfLines={1}
              style={{
                position: 'absolute',
                right: TEXT_PAD_H,
                bottom: TEXT_PAD_V,
                fontFamily: PRETENDARD_REGULAR,
                fontWeight: '400',
                fontSize: SUB_FONT,
                lineHeight: SUB_LH,
                color: '#000000',
                textAlign: 'right',
              }}
            >
              {moreLine}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

/** 핀 anchor — 좌표가 가리키는 정확한 지점 = 말풍선 tail 끝. */
export const MAP_PIN_DIMENSIONS = {
  width: PIN_WIDTH,
  height: TOTAL_HEIGHT,
  anchorX: BUBBLE_TAIL_TIP_X,
  anchorY: MARKER_VISIBLE_BOTTOM + MARKER_GAP + BUBBLE_TAIL_TIP_Y,
} as const;
