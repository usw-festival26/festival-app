/**
 * InformationContent - Information 화면 본문 (Figma 920:4712)
 *
 * 3개 organic blob 카드(흰 배경) + 카드 위에 덮이는 장식 blob 3개.
 * - About (368×215): TL/TR/BR 107.5, BL 10 — title + body
 * - History (368×269): TL/TR/BL 134.5, BR 10 — title + body
 * - Who We Are? (368×578): TL/TR/BR 184, BL 10 — title + body + navy pill + body + navy pill
 *
 * 타이틀: Pretendard-Black 22, #010070 (네이비). 본문: Pretendard-Regular 12, #000000.
 *
 * 장식 blob 3개는 JSX 상 카드보다 뒤에 렌더되어(absolute) 카드 위에 덮인다.
 * 좌표(top/left/size)는 Figma 920:4712 의 Ellipse68/69/70 을 그대로 옮긴 값이다.
 * 헤더(105px) 아래 content 시작점 offset(-99px) 을 적용해 Figma Y 를 contentY 로 변환.
 */
import React from 'react';
import { View, Text, Platform } from 'react-native';
import type { InformationSection } from '../../types/information';
import { GradientBlob } from '../atoms/GradientBlob';

interface BlobCardProps {
  width: number;
  height: number;
  radii: [number, number, number, number]; // [tl, tr, br, bl]
  marginBottom?: number;
  children?: React.ReactNode;
}

function BlobCard({ width, height, radii, marginBottom = 20, children }: BlobCardProps) {
  const [tl, tr, br, bl] = radii;

  return (
    <View
      style={{
        width,
        height,
        borderTopLeftRadius: tl,
        borderTopRightRadius: tr,
        borderBottomRightRadius: br,
        borderBottomLeftRadius: bl,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom,
        position: 'relative',
      }}
    >
      {children}
    </View>
  );
}

const titleStyle = {
  fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Black' }),
  fontWeight: '900' as const,
  fontSize: 22,
  lineHeight: 26,
  color: '#010070',
  letterSpacing: -0.5,
  textAlign: 'center' as const,
};

const bodyStyle = {
  fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' }),
  fontSize: 12,
  lineHeight: 20,
  color: '#000000',
  width: 270,
  textAlign: 'center' as const,
  letterSpacing: -0.3,
};

function CenteredTitle({ top, children }: { top: number; children: React.ReactNode }) {
  return (
    <View style={{ position: 'absolute', top, left: 0, right: 0, alignItems: 'center' }}>
      <Text style={titleStyle}>{children}</Text>
    </View>
  );
}

function CenteredBody({ top, children }: { top: number; children: React.ReactNode }) {
  return (
    <View
      style={{ position: 'absolute', top, left: 0, right: 0, alignItems: 'center' }}
      pointerEvents="none"
    >
      <Text style={bodyStyle}>{children}</Text>
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
    <View style={{ paddingTop: 24, paddingBottom: 40, position: 'relative' }}>
      {/* About */}
      <BlobCard width={368} height={215} radii={[107.5, 107.5, 107.5, 10]} marginBottom={18}>
        <CenteredTitle top={58}>About</CenteredTitle>
        <CenteredBody top={102}>{aboutBody}</CenteredBody>
      </BlobCard>

      {/* History */}
      <BlobCard width={368} height={269} radii={[134.5, 134.5, 10, 134.5]} marginBottom={15}>
        <CenteredTitle top={58}>History</CenteredTitle>
        <CenteredBody top={102}>{historyBody}</CenteredBody>
      </BlobCard>

      {/* Who We Are? */}
      <BlobCard width={368} height={578} radii={[184, 184, 184, 10]} marginBottom={40}>
        <CenteredTitle top={82}>Who We Are?</CenteredTitle>
        <CenteredBody top={138.57}>{whoBody}</CenteredBody>
        <View
          style={{
            position: 'absolute',
            top: 194.57,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
          pointerEvents="none"
        >
          <View style={{ width: 163, height: 107, borderRadius: 53.5, backgroundColor: '#010070' }} />
        </View>
        <CenteredBody top={320}>{whoBody}</CenteredBody>
        <View
          style={{
            position: 'absolute',
            top: 376,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
          pointerEvents="none"
        >
          <View style={{ width: 163, height: 107, borderRadius: 53.5, backgroundColor: '#010070' }} />
        </View>
      </BlobCard>

      {/* 장식 blob — 카드 위에 덮이는 foreground. Figma 920:4712 Ellipse68/69/70.
          contentY = figmaY - 99 (header 105 + About 시작 Figma 123 → 우리 contentY 24). */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 176, left: 272 }}
      >
        <GradientBlob size={154} />
      </View>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 464, left: -3 }}
      >
        <GradientBlob size={92} rotate={90} reversed />
      </View>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 917, left: 283 }}
      >
        <GradientBlob size={289} />
      </View>
    </View>
  );
}
