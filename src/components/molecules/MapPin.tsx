/**
 * MapPin - 지도 위 핀포인트 (Figma 2096:801).
 *
 * SVG 자체를 import 하지 않고 path 데이터만 그대로 옮겨와 react-native-svg 로
 * 인라인 렌더한다. 이유: Figma export SVG 가 `<filter>`, `<mask>` 를 포함해
 * react-native-svg-transformer 가 변환에 실패한다 (Identifier 'Svg' has already
 * been declared 류 SyntaxError). 경로/그라디언트는 `assets/images/pins/*.svg`
 * 파일 내용 그대로 — Figma 디자이너가 export 한 픽셀과 동일하다.
 *
 * 구조 (위에서부터):
 *           ⬤        마커 (티어드롭, 카테고리별 그라디언트)
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
import { Platform, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import type { PinCategory } from '../../types/cluster';

/**
 * 핀 전체 비례 — 1.0 = Figma 원본 (마커 37×40, 말풍선 146×121).
 * SVG path 데이터·gradient 좌표는 viewBox 원본 그대로, 렌더 width/height 만 줄여
 * 마커·말풍선·텍스트가 동시에 따라간다. 이 값만 만지면 전체 사이즈 조절.
 */
const PIN_SCALE = 0.60;

// === 마커 viewBox 원본 (path/gradient 좌표계) ===
// 티어드롭 외곽 path — 세 색 모두 동일.
const MARKER_PATH =
  'M 18.2861 0 C 26.1759 0.000137096 32.5713 6.39634 32.5713 14.2861 C 32.5712 20.2695 28.8927 25.3926 23.6738 27.5195 L 22.6152 29.3535 C 20.6907 32.6867 15.8796 32.6868 13.9551 29.3535 L 12.8955 27.5186 C 7.67793 25.391 4.0001 20.2686 4 14.2861 C 4 6.39626 10.3963 0 18.2861 0 Z';
const MARKER_VB_W = 37;
const MARKER_VB_H = 40;
const MARKER_VB_VISIBLE_BOTTOM = 32; // 티어드롭 tail tip y (그림자 제외)
const MARKER_DOT_CX = 18.4924;
const MARKER_DOT_CY = 14.4929;
const MARKER_DOT_R = 4.469;

// 그라디언트 (좌상→우하): SVG 의 linearGradient x1/y1=28.03/28.23 → x2/y2=6.25/7.12
// 즉 (1,1) → (~0,~0) 정규화 ≈ from 우하 to 좌상.
// cluster 는 새 secondary 팔레트(#A5FFF3 → #0068FF) 적용 — 브랜드 통일.
const MARKER_GRADIENT: Record<PinCategory, readonly [string, string]> = {
  cluster: ['#A5FFF3', '#0068FF'],
  food: ['#FF514E', '#FFBEBF'], // 빨강 핀 아이콘.svg
  facility: ['#00A75C', '#D7FF87'], // 초록 핀 아이콘.svg
};

// === 말풍선 viewBox 원본 ===
// 빨강은 viewBox 가 146×120 으로 1px 짧지만 비례 맞추면 시각차 없음 — 통일.
const BUBBLE_VB_W = 146;
const BUBBLE_VB_H = 121;
const BUBBLE_VB_BODY_H = 106.481;
const BUBBLE_VB_TAIL_TIP_Y = 120;
// 외곽 path — 둥근 사각형 (radius 20) + 하단 가운데 tail.
const BUBBLE_PATH =
  'M 126 0 C 137.046 0 146 8.9543 146 20 V 86.4814 C 146 97.527 137.046 106.481 126 106.481 H 82.9639 L 76.9062 117.78 C 75.0209 121.297 69.9791 121.297 68.0938 117.78 L 62.0361 106.481 H 20 C 8.9544 106.481 0.0002 97.527 0 86.4814 V 20 C 0 8.9543 8.9543 0 20 0 H 126 Z';

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
  const [gradFrom, gradTo] = MARKER_GRADIENT[category];
  const bubbleFill = BUBBLE_FILL[category];
  const gradId = `mapPinMarker-${category}`;

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
      {/* 마커 (상단 가운데) */}
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
        <Svg width={MARKER_W} height={MARKER_H} viewBox={`0 0 ${MARKER_VB_W} ${MARKER_VB_H}`}>
          <Defs>
            <LinearGradient
              id={gradId}
              x1={28.0259}
              y1={28.2337}
              x2={6.25217}
              y2={7.12257}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor={gradFrom} />
              <Stop offset="1" stopColor={gradTo} />
            </LinearGradient>
          </Defs>
          <Path
            d={MARKER_PATH}
            fill={`url(#${gradId})`}
            stroke="#FFFFFF"
            strokeWidth={1}
          />
          <Circle cx={MARKER_DOT_CX} cy={MARKER_DOT_CY} r={MARKER_DOT_R} fill="#FFFFFF" />
        </Svg>
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
          {/* 제목 + 부제 */}
          <View
            style={{
              flex: moreLine ? 0 : 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {title ? (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
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

          {/* 더보기 (오른쪽 하단) */}
          {moreLine ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
            >
              <Text
                numberOfLines={1}
                style={{
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
            </View>
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
