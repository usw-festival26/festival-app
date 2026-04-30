/**
 * MapPin - 지도 위 핀포인트 (Figma 1960:731 기반)
 *
 * 구조 (위에서부터):
 *   ┌──────────────┐
 *   │  Label 1     │  말풍선 (rounded rect, 그라디언트)
 *   │  Label 2     │
 *   │  Label 3     │
 *   └──────▽──────┘  말풍선 꼬리
 *           ⬤        핀 헤드 (circle + downward teardrop)
 *           ▼        앵커 포인트 (이 위치가 coords 와 일치)
 *
 * 카테고리(cluster/food/facility) 별로 셰입은 동일하고 그라디언트 색상만 분기.
 */
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import type { PinCategory } from '../../types/cluster';

const PIN_WIDTH = 146;
const BUBBLE_HEIGHT = 92;
const BUBBLE_TAIL_HEIGHT = 10;
const HEAD_HEIGHT = 40;
const HEAD_WIDTH = 28;
const TOTAL_HEIGHT = BUBBLE_HEIGHT + BUBBLE_TAIL_HEIGHT + HEAD_HEIGHT;

const HEAD_CY = BUBBLE_HEIGHT + BUBBLE_TAIL_HEIGHT + HEAD_WIDTH / 2;

/** 카테고리별 [from, to] 그라디언트 색상 */
const GRADIENT_STOPS: Record<PinCategory, readonly [string, string]> = {
  cluster: ['#FFBEBF', '#0D00FF'],
  food: ['#FFE5C9', '#FF7A00'],
  facility: ['#C7F5DB', '#22C55E'],
};

export interface MapPinProps {
  category: PinCategory;
  /**
   * 1~3줄 라벨. cluster: [단과대명, 멤버이름들, '더보기 >']
   * food: [부스명] 또는 [부스명, 설명]
   * facility: [시설명, 전화번호]
   */
  labelLines: string[];
  onPress?: () => void;
  /** 에디터에서 선택된 핀 표시용 흰 외곽선 */
  selected?: boolean;
}

export function MapPin({ category, labelLines, onPress, selected }: MapPinProps) {
  const [from, to] = GRADIENT_STOPS[category];
  const gradId = `pinGrad-${category}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={labelLines.join(' ')}
      style={{ width: PIN_WIDTH, height: TOTAL_HEIGHT }}
    >
      <Svg width={PIN_WIDTH} height={TOTAL_HEIGHT}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>

        {/* 말풍선 본체 */}
        <Rect
          x={0}
          y={0}
          width={PIN_WIDTH}
          height={BUBBLE_HEIGHT}
          rx={20}
          ry={20}
          fill={`url(#${gradId})`}
        />

        {/* 말풍선 꼬리 (말풍선 → 핀 헤드 연결) */}
        <Path
          d={`M ${PIN_WIDTH / 2 - 9} ${BUBBLE_HEIGHT}
              L ${PIN_WIDTH / 2} ${BUBBLE_HEIGHT + BUBBLE_TAIL_HEIGHT}
              L ${PIN_WIDTH / 2 + 9} ${BUBBLE_HEIGHT} Z`}
          fill={to}
        />

        {/* 핀 헤드 — teardrop (원 + 아래로 뻗는 꼬리) */}
        <Path
          d={`M ${PIN_WIDTH / 2} ${TOTAL_HEIGHT}
              L ${PIN_WIDTH / 2 - HEAD_WIDTH / 2 + 2} ${HEAD_CY + 4}
              A ${HEAD_WIDTH / 2} ${HEAD_WIDTH / 2} 0 1 1 ${PIN_WIDTH / 2 + HEAD_WIDTH / 2 - 2} ${HEAD_CY + 4}
              Z`}
          fill={to}
        />
        <Circle cx={PIN_WIDTH / 2} cy={HEAD_CY} r={HEAD_WIDTH / 2} fill={to} />
        <Circle cx={PIN_WIDTH / 2} cy={HEAD_CY} r={5} fill="#FFFFFF" />

        {/* 선택 표시 */}
        {selected ? (
          <Rect
            x={1.5}
            y={1.5}
            width={PIN_WIDTH - 3}
            height={BUBBLE_HEIGHT - 3}
            rx={20}
            ry={20}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={3}
          />
        ) : null}
      </Svg>

      {/* 텍스트 오버레이 — 말풍선 영역 안 */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          top: 0,
          height: BUBBLE_HEIGHT,
          justifyContent: 'center',
        }}
      >
        {labelLines.slice(0, 3).map((line, i) => (
          <Text
            key={i}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontFamily: Platform.select({
                web: 'Pretendard Variable',
                default: i === 0 ? 'Pretendard-SemiBold' : 'Pretendard-Regular',
              }),
              fontWeight: i === 0 ? '600' : '400',
              fontSize: i === 0 ? 15 : 12,
              lineHeight: i === 0 ? 20 : 16,
              color: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            {line}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}

/**
 * 핀 배치 시 좌표가 핀의 어느 지점을 가리키는지 — 핀 헤드 끝(말풍선 아래 마커 tip).
 * 부모는 left = coords.x * imgW - anchorX, top = coords.y * imgH - anchorY 로 배치.
 */
export const MAP_PIN_DIMENSIONS = {
  width: PIN_WIDTH,
  height: TOTAL_HEIGHT,
  anchorX: PIN_WIDTH / 2,
  anchorY: TOTAL_HEIGHT,
} as const;
