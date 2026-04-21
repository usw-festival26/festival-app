/**
 * InformationContent - Information 화면 본문 (Figma 1228:1182)
 *
 * 3개 organic blob 카드:
 * - About (368×215): TL/TR/BR 107.5, BL 10
 * - History (368×269): TL/TR/BL 134.5, BR 10
 * - Who We Are? (368×578): TL/TR/BR 184, BL 10 + 다크 네이비 pill 2개(163×107, r53.5) placeholder
 *
 * 배경은 반투명 linear-gradient(navy 40% → pink 40%), 흰색 1px 50% 보더.
 */
import React from 'react';
import { View, Text, Platform } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import type { InformationSection } from '../../types/information';

/**
 * CSS linear-gradient angle을 SVG x1/y1/x2/y2 비율로 변환.
 * CSS 기준: 0° = 위(N), 시계 방향으로 증가 → (dx, dy) = (sinθ, -cosθ).
 */
function angleToLine(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  return {
    x1: `${((0.5 - dx / 2) * 100).toFixed(2)}%`,
    y1: `${((0.5 - dy / 2) * 100).toFixed(2)}%`,
    x2: `${((0.5 + dx / 2) * 100).toFixed(2)}%`,
    y2: `${((0.5 + dy / 2) * 100).toFixed(2)}%`,
  };
}

interface BlobCardProps {
  title: string;
  titleTop: number;
  bodyTop: number;
  body?: string;
  bodyWidth?: number;
  width: number;
  height: number;
  radii: [number, number, number, number]; // [tl, tr, br, bl]
  gradientAngle: number;
  gradientId: string;
  children?: React.ReactNode;
}

function BlobCard({
  title,
  titleTop,
  bodyTop,
  body,
  bodyWidth = 270,
  width,
  height,
  radii,
  gradientAngle,
  gradientId,
  children,
}: BlobCardProps) {
  const [tl, tr, br, bl] = radii;
  const line = angleToLine(gradientAngle);

  return (
    <View
      style={{
        width,
        height,
        borderTopLeftRadius: tl,
        borderTopRightRadius: tr,
        borderBottomRightRadius: br,
        borderBottomLeftRadius: bl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 20,
        position: 'relative',
      }}
    >
      <Svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id={gradientId} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}>
            <Stop offset="13.548%" stopColor="#0D00FF" stopOpacity={0.4} />
            <Stop offset="84.597%" stopColor="#FFBEBF" stopOpacity={0.4} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${gradientId})`} />
      </Svg>

      <View style={{ position: 'absolute', top: titleTop, left: 0, right: 0, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Black' }),
            fontWeight: '900',
            fontSize: 22,
            lineHeight: 26,
            color: '#FFFFFF',
            letterSpacing: -0.5,
          }}
        >
          {title}
        </Text>
      </View>

      {body ? (
        <View
          style={{ position: 'absolute', top: bodyTop, left: 0, right: 0, alignItems: 'center' }}
          pointerEvents="none"
        >
          <Text
            style={{
              fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' }),
              fontSize: 12,
              lineHeight: 20,
              color: '#FFFFFF',
              width: bodyWidth,
              textAlign: 'center',
              letterSpacing: -0.3,
            }}
          >
            {body}
          </Text>
        </View>
      ) : null}

      {children}
    </View>
  );
}

export interface InformationContentProps {
  sections: InformationSection[];
}

export function InformationContent({ sections }: InformationContentProps) {
  const aboutBody = sections[0]?.body ?? '';
  const historyBody = sections[1]?.body ?? '';
  const whoBody = sections[2]?.body ?? '';

  return (
    <View style={{ paddingTop: 32, paddingBottom: 40 }}>
      <BlobCard
        title="About"
        width={368}
        height={215}
        radii={[107.5, 107.5, 107.5, 10]}
        gradientAngle={-28.39}
        gradientId="info-grad-about"
        titleTop={58}
        bodyTop={100}
        body={aboutBody}
      />

      <BlobCard
        title="History"
        width={368}
        height={269}
        radii={[134.5, 134.5, 10, 134.5]}
        gradientAngle={-34.07}
        gradientId="info-grad-history"
        titleTop={58}
        bodyTop={100}
        body={historyBody}
      />

      <BlobCard
        title="Who We Are?"
        width={368}
        height={578}
        radii={[184, 184, 184, 10]}
        gradientAngle={-55.46}
        gradientId="info-grad-who"
        titleTop={82}
        bodyTop={140}
        body={whoBody}
      >
        {/* 팀 카드 placeholder — 다크 네이비 pill 2개 (추후 팀 소개 카드로 교체) */}
        <View
          style={{
            position: 'absolute',
            top: 290,
            left: 0,
            right: 0,
            alignItems: 'center',
            gap: 20,
          }}
          pointerEvents="none"
        >
          <View style={{ width: 163, height: 107, borderRadius: 53.5, backgroundColor: '#010070' }} />
          <View style={{ width: 163, height: 107, borderRadius: 53.5, backgroundColor: '#010070' }} />
        </View>
      </BlobCard>
    </View>
  );
}
