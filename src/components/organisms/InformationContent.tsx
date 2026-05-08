/**
 * InformationContent - Information 화면 본문 (Figma 2304:629)
 *
 * 구조: About blob 카드 + "Who We Are?" 타이틀 + 개발팀 7명 카드 (좌-우 교차).
 * 장식 GradientBlob 들은 카드 뒤가 아니라 위에 덮인다 (Figma 와 동일).
 *
 * About 카드 본문은 동아리 소개 멀티라인 + 인스타그램/사이트 인라인 링크.
 * Linking.canOpenURL 가드 후 openURL — IG 앱 미설치/외부 차단 시 silent noop.
 */
import React from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import { GradientBlob } from '../atoms/GradientBlob';
import { DeveloperCard } from '../molecules/DeveloperCard';
import type { Developer } from '../../types/information';

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
  color: '#0068FF',
  letterSpacing: -0.5,
  textAlign: 'center' as const,
};

const bodyStyle = {
  fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' }),
  fontSize: 12,
  lineHeight: 19,
  color: '#001E56',
  textAlign: 'center' as const,
  letterSpacing: -0.3,
};

const linkStyle = {
  color: '#0068FF',
  textDecorationLine: 'underline' as const,
};

async function openExternal(url: string) {
  try {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  } catch {
    // 외부 앱 열기 실패는 사용자 입장에선 무반응으로 처리.
  }
}

export interface InformationContentProps {
  aboutBody: string;
  instagramUrl: string;
  siteUrl: string;
  developers: Developer[];
}

export function InformationContent({
  aboutBody,
  instagramUrl,
  siteUrl,
  developers,
}: InformationContentProps) {
  return (
    <View style={{ paddingTop: 24, position: 'relative', overflow: 'hidden' }}>
      {/* 장식 GradientBlob — 카드 뒤로 깔리도록 가장 먼저 렌더.
          Figma 2304:629 좌표. contentY = figmaY - 99
          (헤더 105 + paddingTop 24 - About Figma top 123). */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 487, left: 296 }}>
        <GradientBlob size={154} />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 861, left: 0 }}>
        <GradientBlob size={92} rotate={90} reversed />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 1258, left: 283 }}>
        <GradientBlob size={289} />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 1743, left: -123 }}>
        <GradientBlob size={329} rotate={56.4} />
      </View>

      {/* About — Figma 368×572 */}
      <BlobCard
        width={368}
        height={572}
        radii={[107.5, 107.5, 107.5, 10]}
        marginBottom={45}
      >
        <View
          style={{ position: 'absolute', top: 58, left: 0, right: 0, alignItems: 'center' }}
          pointerEvents="none"
        >
          <Text style={titleStyle}>About</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 95,
            left: 0,
            right: 0,
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Text style={[bodyStyle, { width: 320 }]}>
            {aboutBody}
            {'\n\n인스타그램: '}
            <Text
              style={linkStyle}
              accessibilityRole="link"
              accessibilityLabel="멋쟁이사자처럼 수원대 인스타그램 열기"
              onPress={() => openExternal(instagramUrl)}
            >
              @likelion_suwon
            </Text>
            {'\n사이트: '}
            <Text
              style={linkStyle}
              accessibilityRole="link"
              accessibilityLabel="멋쟁이사자처럼 수원대 공식 사이트 열기"
              onPress={() => openExternal(siteUrl)}
            >
              {siteUrl}
            </Text>
          </Text>
        </View>
      </BlobCard>

      {/* Who We Are? 타이틀 */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={titleStyle}>Who We Are?</Text>
      </View>

      {/* 개발팀 카드 — 좌/우 교차 */}
      {developers.map((dev, idx) => (
        <View key={dev.id} style={{ marginBottom: idx === developers.length - 1 ? 0 : 48 }}>
          <DeveloperCard developer={dev} side={idx % 2 === 0 ? 'left' : 'right'} />
        </View>
      ))}
    </View>
  );
}
