/**
 * FaqBubble - 말풍선 (Figma 기반, assets/images/Group 1707481735.svg 형태)
 *
 * - 전체 357×65 기준: 본문 rounded-20 흰 카드(335×65) + 좌/우 옆구리에 돋아난 갈매기형 꼬리.
 * - tail='left': 꼬리가 좌측으로 튀어나옴(기본). tail='right': 수평 미러.
 * - 본문 텍스트는 꼬리 반대쪽 여백을 더 크게 두어 꼬리와 겹치지 않게 한다.
 * - height 65 는 본문 1줄 기준. answer 등 내용이 길어져 높이가 늘어나면 SVG 는 100% 로 늘어난다.
 */
import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

export interface FaqBubbleProps {
  question: string;
  answer?: string;
  tail?: 'left' | 'right';
}

const TOTAL_WIDTH = 357;
const BODY_WIDTH = 335;
const HEIGHT = 65;
// SVG 의 꼬리 path (좌측용, 원본 그대로). 우측용은 컨테이너에 scaleX: -1 를 적용한다.
const TAIL_PATH =
  'M7.5 37.3301C4.16667 35.4056 4.16667 30.5944 7.5 28.6699L22.5 20.0096C25.8333 18.0851 30 20.4907 30 24.3397L30 41.6602C30 45.5092 25.8333 47.9149 22.5 45.9904L7.5 37.3301Z';

export function FaqBubble({ question, answer, tail = 'left' }: FaqBubbleProps) {
  // 꼬리 측 여백은 본문과 꼬리가 겹치지 않도록 크게, 반대쪽은 표준 18px.
  const padLeft = tail === 'left' ? 40 : 18;
  const padRight = tail === 'right' ? 40 : 18;

  return (
    <View
      style={{
        width: TOTAL_WIDTH,
        minHeight: HEIGHT,
        position: 'relative',
        transform: tail === 'right' ? [{ scaleX: -1 }] : undefined,
      }}
    >
      {/* 배경 말풍선 shape (본문 + 좌측 꼬리). 부모에 scaleX:-1 이 걸리면 우측 꼬리로 보인다. */}
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${TOTAL_WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Rect x={22} y={0} width={BODY_WIDTH} height={HEIGHT} rx={20} fill="#FFFFFF" />
        <Path d={TAIL_PATH} fill="#FFFFFF" />
      </Svg>

      {/* 본문 텍스트. 부모 scaleX:-1 이 걸려 있을 수 있어 다시 -1 로 뒤집어 정상 표시. */}
      <View
        style={{
          flex: 1,
          minHeight: HEIGHT,
          paddingVertical: 12,
          paddingLeft: padLeft,
          paddingRight: padRight,
          justifyContent: 'center',
          transform: tail === 'right' ? [{ scaleX: -1 }] : undefined,
        }}
      >
        <Text style={styles.question}>{question}</Text>
        {answer ? <Text style={styles.answer}>{answer}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  question: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-SemiBold' }),
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
    color: '#02015B',
  },
  answer: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-Regular' }),
    fontSize: 13,
    lineHeight: 19,
    color: '#3F3F5C',
    marginTop: 4,
  },
});
