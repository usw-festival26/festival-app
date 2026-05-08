/**
 * MapPin - 지도 위 핀포인트 (Figma 2139:1683 — 신규 디자인).
 *
 * 마커(티어드롭)와 말풍선 모두 디자이너가 export 한 PNG 그대로 사용:
 *  - 마커: `assets/images/pins/{빨강|초록|파랑} 핀 아이콘.png` (37×40)
 *  - 말풍선: `assets/images/pins/{빨강|초록|파랑} 핀 유니온.png` (134×94)
 *      └ "더보기 >" 텍스트가 이미 PNG 안에 baked 되어 있어, 코드에선 title 만 오버레이.
 *
 * 구조 (위에서부터):
 *           ⬤        마커 (PNG)
 *                    ↕ MARKER_GAP
 *   ╭──────────────╮
 *   │  Title    더보기› │  말풍선 PNG (제목 영역은 좌측에만, 우측엔 PNG 가 가진 더보기)
 *   ╰──────▽──────╯
 *
 * labelLines 슬롯 (cluster/food/facility 모두 첫 항목만 title 로 표시 — 더보기/멤버는 무시)
 *
 * anchor: 말풍선 하단 중앙. 기존 cluster coords 와 시각 정합성 유지.
 */
import React from 'react';
import { Image, Platform, Pressable, Text, View, type ImageSourcePropType } from 'react-native';
import type { PinCategory } from '../../types/cluster';

/**
 * 핀 전체 비례 — 1.0 = Figma 원본 (마커 37×40, 말풍선 134×94 PNG export).
 */
const PIN_SCALE = 0.45;

// === 마커 PNG 원본 비율 (37×40) ===
const MARKER_VB_W = 37;
const MARKER_VB_H = 40;
const MARKER_VB_VISIBLE_BOTTOM = 32;

const MARKER_SOURCE: Record<PinCategory, ImageSourcePropType> = {
  cluster: require('../../../assets/images/pins/파랑 핀 아이콘.png'),
  food: require('../../../assets/images/pins/빨강 핀 아이콘.png'),
  facility: require('../../../assets/images/pins/초록 핀 아이콘.png'),
};

// === 말풍선 PNG (Figma 2139:1683 export, 134×94) ===
// 외곽 4-5px 정도 shadow/stroke 여유 + 우측 ~33% 영역에 "더보기 >" 가 baked-in.
const BUBBLE_VB_W = 134;
const BUBBLE_VB_H = 94;
/**
 * 본문 좌우 padding (viewBox 단위). PNG 외곽 shadow/stroke ≈4px + 안쪽 여유 4px.
 * Title 은 말풍선 전체 폭에 가운데 정렬 — PNG 우측 baked "더보기 >" 와 작은 글자 시
 * 겹칠 수 있으나 PIN_SCALE 작게 두면 시각적으로 어색하지 않음.
 */
const BUBBLE_TEXT_PAD_X = 8;
const BUBBLE_TEXT_PAD_Y = 8;

const BUBBLE_SOURCE: Record<PinCategory, ImageSourcePropType> = {
  cluster: require('../../../assets/images/pins/파랑 핀 유니온.png'),
  food: require('../../../assets/images/pins/빨강 핀 유니온.png'),
  facility: require('../../../assets/images/pins/초록 핀 유니온.png'),
};

const TEXT_COLOR = '#001E56';

// === 렌더 치수 (PIN_SCALE 적용) ===
const MARKER_W = MARKER_VB_W * PIN_SCALE;
const MARKER_H = MARKER_VB_H * PIN_SCALE;
const MARKER_VISIBLE_BOTTOM = MARKER_VB_VISIBLE_BOTTOM * PIN_SCALE;
const BUBBLE_W = BUBBLE_VB_W * PIN_SCALE;
const BUBBLE_H = BUBBLE_VB_H * PIN_SCALE;
const MARKER_GAP = 4 * PIN_SCALE;
const PIN_WIDTH = BUBBLE_W;
const TOTAL_HEIGHT = MARKER_VISIBLE_BOTTOM + MARKER_GAP + BUBBLE_H;

// 본문 영역 padding (rendered px) — 더보기는 PNG 가 처리, title 은 가로 가운데 정렬.
const TEXT_PAD_H = BUBBLE_TEXT_PAD_X * PIN_SCALE;
const TEXT_PAD_V = BUBBLE_TEXT_PAD_Y * PIN_SCALE;

// Title 영역 = 말풍선 상단 ~45% (PNG baked "더보기 >" 가 세로 중앙-우측에 있어, 그
// 영역과 겹치지 않게 title 을 위쪽으로 끌어올림). 가로는 전체 폭 가운데 정렬.
const TITLE_AREA_HEIGHT = BUBBLE_H * 0.5;

// === 텍스트 (PIN_SCALE 적용 + 최소 가독 폰트 보장) ===
// 작은 핀 안에서 풀네임이 들어오게 minimum 을 8 로 낮춤.
const MIN_TITLE_FONT = 8;
const TITLE_FONT = Math.max(15 * PIN_SCALE, MIN_TITLE_FONT);
const TITLE_LH = TITLE_FONT * (18 / 15);

const PRETENDARD_SEMIBOLD = Platform.select({
  web: 'Pretendard Variable',
  default: 'Pretendard-SemiBold',
});

export interface MapPinProps {
  category: PinCategory;
  /**
   * 1~3줄 라벨. cluster: [단과대명, 멤버이름들, '더보기 >']
   * food: [부스명] 또는 [부스명, 설명]
   * facility: [시설명, 전화번호]
   * 신규 디자인은 첫 항목(title) 만 노출하고 나머지는 PNG/시안에 흡수.
   */
  labelLines: string[];
  onPress?: () => void;
  /** 에디터에서 선택된 핀 강조 — 살짝 확대 */
  selected?: boolean;
}

export function MapPin({ category, labelLines, onPress, selected }: MapPinProps) {
  const lines = labelLines.slice(0, 3);
  const moreIdx = lines.findIndex((l) => l.trim().startsWith('더보기'));
  const otherLines = moreIdx >= 0 ? lines.slice(0, moreIdx) : lines;
  const title = otherLines[0];

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
        }}
      >
        <Image
          source={MARKER_SOURCE[category]}
          style={{ width: MARKER_W, height: MARKER_H }}
          resizeMode="contain"
        />
      </View>

      {/* 말풍선 (PNG: 카테고리별 색상 + baked 된 "더보기 >") */}
      <View
        style={{
          position: 'absolute',
          top: MARKER_VISIBLE_BOTTOM + MARKER_GAP,
          left: 0,
          width: BUBBLE_W,
          height: BUBBLE_H,
        }}
      >
        <Image
          source={BUBBLE_SOURCE[category]}
          style={{ width: BUBBLE_W, height: BUBBLE_H }}
          resizeMode="contain"
        />

        {/* Title 오버레이 — 말풍선 상단 ~50% 영역 (PNG baked 더보기보다 위) + 가로 가운데. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: TEXT_PAD_V,
            left: 0,
            width: BUBBLE_W,
            height: TITLE_AREA_HEIGHT,
            paddingHorizontal: TEXT_PAD_H,
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
      </View>
    </Pressable>
  );
}

/**
 * 핀 anchor — 좌표가 가리키는 지점.
 * 말풍선 PNG 하단 중앙(꼬리 tip 부근). 기존 cluster coords 와 시각 정합 유지.
 */
export const MAP_PIN_DIMENSIONS = {
  width: PIN_WIDTH,
  height: TOTAL_HEIGHT,
  anchorX: BUBBLE_W / 2,
  anchorY: MARKER_VISIBLE_BOTTOM + MARKER_GAP + BUBBLE_H,
} as const;
