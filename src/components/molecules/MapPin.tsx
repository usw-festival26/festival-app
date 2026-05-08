/**
 * MapPin - 지도 위 핀포인트 (Figma 2139:1683 — 신규 디자인).
 *
 * 마커(티어드롭)는 디자이너가 export 한 PNG 그대로 사용
 * (`assets/images/pins/{빨강|초록|파랑} 핀 아이콘.png`).
 * 말풍선은 react-native-svg `<Rect>` 로 인라인 렌더 — Figma 신규 디자인에선
 * 꼬리 없이 둥근 직사각형(126×85, r=30)이고 마커가 위에 떠 있는 구조.
 *
 * 구조 (위에서부터):
 *           ⬤        마커 (PNG, 카테고리별 색상)
 *                    ↕ MARKER_GAP
 *   ╭──────────────╮
 *   │  Title       │  말풍선 (둥근 직사각형, 카테고리별 옅은 색)
 *   │  Subtitle    │
 *   │       더보기› │  더보기 = 우하단 absolute
 *   ╰──────────────╯  bottom 모서리 = anchor (지도 좌표가 가리키는 점)
 *
 * labelLines 슬롯
 *  - cluster: [name, members, '더보기 >']
 *  - food:    [name]
 *  - facility:[name(, phone)]
 *
 * anchor: 말풍선 하단 중앙. Figma 디자인이 꼬리를 없앴으나 anchor 의미를 유지해
 *   기존 cluster coords(.x,.y) 가 시각적으로 같은 위치에 떨어지게 한다.
 *   (꼬리 tip 대신 bottom edge 가 좌표를 가리키도록.)
 */
import React from 'react';
import { Image, Platform, Pressable, Text, View, type ImageSourcePropType } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import type { PinCategory } from '../../types/cluster';

/**
 * 핀 전체 비례 — 1.0 = Figma 원본 (마커 28.571×31.853, 말풍선 126×85.225, r=30).
 * 마커 PNG 와 말풍선 SVG 는 viewBox 비율 그대로, 렌더 width/height 만 조절.
 * 이 값만 바꾸면 마커·말풍선·텍스트가 동시 follow.
 */
const PIN_SCALE = 0.5;

// === 마커 원본 비율 (PNG, 37×40 — Figma export 자산) ===
const MARKER_VB_W = 37;
const MARKER_VB_H = 40;
const MARKER_VB_VISIBLE_BOTTOM = 32; // 티어드롭 tail tip y (그림자 제외)

const MARKER_SOURCE: Record<PinCategory, ImageSourcePropType> = {
  cluster: require('../../../assets/images/pins/파랑 핀 아이콘.png'),
  food: require('../../../assets/images/pins/빨강 핀 아이콘.png'),
  facility: require('../../../assets/images/pins/초록 핀 아이콘.png'),
};

// === 말풍선 viewBox (Figma 2139:1683 — 둥근 직사각형, 꼬리 없음) ===
const BUBBLE_VB_W = 126;
const BUBBLE_VB_H = 85;
const BUBBLE_VB_RADIUS = 30; // capsule 에 가까운 매우 둥근 corner

const BUBBLE_FILL: Record<PinCategory, string> = {
  cluster: '#DBEEFF', // 파랑 마커 → 옅은 cyan (Figma 신규 시안)
  food: '#FFE5E5', // 빨강 마커 → 옅은 pink
  facility: '#EBFFF3', // 초록 마커 → 옅은 mint
};

const TEXT_COLOR = '#001E56'; // Figma 본문 강조: text-[#001e56]

// === 렌더 치수 (PIN_SCALE 적용) ===
const MARKER_W = MARKER_VB_W * PIN_SCALE;
const MARKER_H = MARKER_VB_H * PIN_SCALE;
const MARKER_VISIBLE_BOTTOM = MARKER_VB_VISIBLE_BOTTOM * PIN_SCALE;
const BUBBLE_W = BUBBLE_VB_W * PIN_SCALE;
const BUBBLE_H = BUBBLE_VB_H * PIN_SCALE;
const MARKER_GAP = 4 * PIN_SCALE; // 마커-말풍선 사이 간격 (꼬리 없으니 작게)
const PIN_WIDTH = BUBBLE_W;
const TOTAL_HEIGHT = MARKER_VISIBLE_BOTTOM + MARKER_GAP + BUBBLE_H;

// === 텍스트 (PIN_SCALE 적용 + 최소 가독 폰트 보장) ===
// Math.max 로 PIN_SCALE 이 작아져도 한글 라벨이 읽히는 임계치(11/9) 아래로 떨어지지 않게.
// 폰트만 떠받치고 말풍선 자체는 PIN_SCALE 그대로라, 긴 라벨은 numberOfLines+ellipsis 로 잘림.
const MIN_TITLE_FONT = 11;
const MIN_SUB_FONT = 9;
const TITLE_FONT = Math.max(15 * PIN_SCALE, MIN_TITLE_FONT);
const TITLE_LH = TITLE_FONT * (18 / 15);
const SUB_FONT = Math.max(12 * PIN_SCALE, MIN_SUB_FONT); // 더보기 line
const SUB_LH = SUB_FONT * (14 / 12);
const TEXT_PAD_H = 14 * PIN_SCALE;
const TEXT_PAD_V = 10 * PIN_SCALE;

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
  // subtitle (과/멤버 이름 등) 은 신규 Figma 디자인에서 표시하지 않음.

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
          // RN shadow (iOS) + elevation (Android) — Figma filter dropShadow 대체
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
          <Rect
            x={0}
            y={0}
            width={BUBBLE_VB_W}
            height={BUBBLE_VB_H}
            rx={BUBBLE_VB_RADIUS}
            ry={BUBBLE_VB_RADIUS}
            fill={bubbleFill}
            stroke="#FFFFFF"
            strokeWidth={1}
          />
        </Svg>

        {/* 텍스트 오버레이 — 본문 영역 */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: BUBBLE_W,
            height: BUBBLE_H,
            paddingHorizontal: TEXT_PAD_H,
            paddingVertical: TEXT_PAD_V,
          }}
        >
          {/* 제목 + 부제 — 말풍선 정중앙 정렬.
              더보기는 absolute 로 빼서 column flex 에서 분리. */}
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
                  color: TEXT_COLOR,
                  textAlign: 'center',
                }}
              >
                {title}
              </Text>
            ) : null}
          </View>

          {/* 더보기 — 우하단 absolute */}
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
                color: TEXT_COLOR,
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

/**
 * 핀 anchor — 좌표가 가리키는 정확한 지점.
 * Figma 신규 디자인은 꼬리가 없지만, 기존 cluster coords 와의 시각 정합성을 위해
 * 말풍선 하단 중앙을 anchor 로 유지 (= 좌표가 말풍선 아래쪽 모서리에 닿음).
 */
export const MAP_PIN_DIMENSIONS = {
  width: PIN_WIDTH,
  height: TOTAL_HEIGHT,
  anchorX: BUBBLE_W / 2,
  anchorY: MARKER_VISIBLE_BOTTOM + MARKER_GAP + BUBBLE_H,
} as const;
