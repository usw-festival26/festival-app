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
import { Colors } from '@constants/colors';
import type { PinCategory } from '../../types/cluster';

const PIN_WIDTH = 73;
const BUBBLE_HEIGHT = 46;
const BUBBLE_TAIL_HEIGHT = 5;
const HEAD_HEIGHT = 20;
const HEAD_WIDTH = 14;
const TOTAL_HEIGHT = BUBBLE_HEIGHT + BUBBLE_TAIL_HEIGHT + HEAD_HEIGHT;

const HEAD_CY = BUBBLE_HEIGHT + BUBBLE_TAIL_HEIGHT + HEAD_WIDTH / 2;

/**
 * 카테고리별 [from, to] 그라디언트 색상.
 * to 끝 색상은 `Colors.festival.pin*` 토큰과 일원화 (tailwind.config.js 와도 동기).
 * from 시작 색상은 그라디언트 전용이라 토큰화 안 함.
 */
const GRADIENT_STOPS: Record<PinCategory, readonly [string, string]> = {
  cluster: ['#FFBEBF', Colors.festival.pinCluster],
  food: ['#FFE5C9', Colors.festival.pinFood],
  facility: ['#C7F5DB', Colors.festival.pinFacility],
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
          rx={10}
          ry={10}
          fill={`url(#${gradId})`}
        />

        {/* 말풍선 꼬리 (말풍선 → 핀 헤드 연결) */}
        <Path
          d={`M ${PIN_WIDTH / 2 - 4.5} ${BUBBLE_HEIGHT}
              L ${PIN_WIDTH / 2} ${BUBBLE_HEIGHT + BUBBLE_TAIL_HEIGHT}
              L ${PIN_WIDTH / 2 + 4.5} ${BUBBLE_HEIGHT} Z`}
          fill={to}
        />

        {/* 핀 헤드 — teardrop (원 + 아래로 뻗는 꼬리) */}
        <Path
          d={`M ${PIN_WIDTH / 2} ${TOTAL_HEIGHT}
              L ${PIN_WIDTH / 2 - HEAD_WIDTH / 2 + 1} ${HEAD_CY + 2}
              A ${HEAD_WIDTH / 2} ${HEAD_WIDTH / 2} 0 1 1 ${PIN_WIDTH / 2 + HEAD_WIDTH / 2 - 1} ${HEAD_CY + 2}
              Z`}
          fill={to}
        />
        <Circle cx={PIN_WIDTH / 2} cy={HEAD_CY} r={HEAD_WIDTH / 2} fill={to} />
        <Circle cx={PIN_WIDTH / 2} cy={HEAD_CY} r={2.5} fill="#FFFFFF" />

        {/* 선택 표시 */}
        {selected ? (
          <Rect
            x={0.75}
            y={0.75}
            width={PIN_WIDTH - 1.5}
            height={BUBBLE_HEIGHT - 1.5}
            rx={10}
            ry={10}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        ) : null}
      </Svg>

      {/* 텍스트 오버레이 — 말풍선 영역 안 */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 6,
          right: 6,
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
              fontSize: i === 0 ? 11 : 9,
              lineHeight: i === 0 ? 14 : 12,
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
