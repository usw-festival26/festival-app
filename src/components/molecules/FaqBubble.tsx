/**
 * FaqBubble - FAQ 말풍선 카드 (Figma 920:4490)
 *
 * 322×65 rounded-[20px] 흰 카드. tail='left' | 'right'로 꼭지를 좌/우 하단에 배치.
 */
import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

export interface FaqBubbleProps {
  question: string;
  answer?: string;
  tail?: 'left' | 'right';
}

const WIDTH = 322;
const HEIGHT = 65;
const TAIL_W = 14;
const TAIL_H = 10;

export function FaqBubble({ question, answer, tail = 'left' }: FaqBubbleProps) {
  return (
    <View style={{ width: WIDTH, alignItems: tail === 'left' ? 'flex-start' : 'flex-end' }}>
      <View
        style={{
          width: WIDTH,
          minHeight: HEIGHT,
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          paddingVertical: 12,
          paddingHorizontal: 18,
          justifyContent: 'center',
        }}
      >
        <Text style={styles.question}>{question}</Text>
        {answer ? <Text style={styles.answer}>{answer}</Text> : null}
      </View>
      <Svg
        width={TAIL_W}
        height={TAIL_H}
        style={{
          marginLeft: tail === 'left' ? 22 : 0,
          marginRight: tail === 'right' ? 22 : 0,
          marginTop: -1,
        }}
      >
        <Polygon
          points={`0,0 ${TAIL_W},0 ${TAIL_W / 2},${TAIL_H}`}
          fill="#FFFFFF"
        />
      </Svg>
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
