/**
 * InformationContent - Information 화면 본문 (Figma 2304:629)
 *
 * 구조: About blob 카드 + "Who We Are?" 타이틀 + 개발팀 7명 카드 (좌-우 교차)
 *      + "한마디" 입력 카드.
 * 장식 GradientBlob 들은 카드 뒤가 아니라 위에 덮인다 (Figma 와 동일).
 *
 * About 카드 본문은 segments 배열로 받아 weight 별로 fontFamily 분기.
 * Figma 의 SemiBold 강조 (LIKELION USW 14th / 국내 최대 규모의 IT 창업 동아리 등) 보존.
 * 마지막에 인스타그램/사이트 인라인 링크 — Linking.canOpenURL 가드 후 openURL.
 *
 * "한마디" 카드는 백엔드 미정 상태의 placeholder. onGuestbookSubmit prop 미전달 시
 * 로컬 처리만 — API endpoint 정해지면 prop 으로 연결.
 */
import React from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import { GradientBlob } from '@components/atoms';
import { DeveloperCard, GuestbookForm } from '@components/molecules';
import type { Developer } from '@types';
import type { AboutBodySegment } from '@hooks';

interface BlobCardProps {
  width: number;
  /**
   * 최소 높이 — 디자인 시안의 고정 높이를 보장하면서 본문이 길어지면 자연 확장.
   * (이전엔 height 고정 + overflow:hidden 으로 긴 본문이 잘렸음.)
   */
  minHeight?: number;
  radii: [number, number, number, number]; // [tl, tr, br, bl]
  marginBottom?: number;
  children?: React.ReactNode;
}

function BlobCard({ width, minHeight, radii, marginBottom = 20, children }: BlobCardProps) {
  const [tl, tr, br, bl] = radii;

  return (
    <View
      style={{
        width,
        minHeight,
        borderTopLeftRadius: tl,
        borderTopRightRadius: tr,
        borderBottomRightRadius: br,
        borderBottomLeftRadius: bl,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom,
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

// SemiBold 강조용 — segment.weight === 'semibold' 인 부분에만 override 적용.
const bodySemiboldStyle = {
  fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' }),
  fontWeight: '600' as const,
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
  /** Figma 의 weight 강조 그대로 반영하는 segment 배열 */
  aboutSegments: ReadonlyArray<AboutBodySegment>;
  instagramUrl: string;
  siteUrl: string;
  developers: Developer[];
  /**
   * "한마디" 카드 제출 콜백. 미전달 시 GuestbookForm 의 default 동작
   * (console.log + 입력 초기화) 만. 백엔드 endpoint 정해지면 부모에서 연결.
   */
  onGuestbookSubmit?: (message: string) => void | Promise<void>;
}

export function InformationContent({
  aboutSegments,
  instagramUrl,
  siteUrl,
  developers,
  onGuestbookSubmit,
}: InformationContentProps) {
  return (
    <View style={{ paddingTop: 18, position: 'relative', overflow: 'hidden' }}>
      {/* 장식 GradientBlob — 카드 뒤로 깔리도록 가장 먼저 렌더.
          Figma 2304:629 좌표. contentY = figmaY - 93
          (헤더 105 + paddingTop 18 - figmaY 30 보정 = 93). */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 493, left: 296 }}>
        <GradientBlob size={154} />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 867, left: 0 }}>
        <GradientBlob size={92} rotate={90} reversed />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 1264, left: 283 }}>
        <GradientBlob size={289} />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 1749, left: -123 }}>
        <GradientBlob size={329} rotate={56.4} />
      </View>

      {/* About — Figma 368×572 (minHeight, 본문 길이에 따라 확장) */}
      <BlobCard
        width={368}
        minHeight={572}
        radii={[107.5, 107.5, 107.5, 10]}
        marginBottom={45}
      >
        {/* 시안 좌표(top:58 / top:95) 를 padding 으로 풀어 flow 레이아웃 — 본문 잘림 회피 */}
        <View style={{ paddingTop: 58, alignItems: 'center' }} pointerEvents="none">
          <Text style={titleStyle}>About</Text>
        </View>
        <View
          style={{
            paddingTop: 7,
            paddingBottom: 35,
            paddingHorizontal: 24,
            alignItems: 'center',
          }}
        >
          <Text style={[bodyStyle, { width: 320 }]}>
            {aboutSegments.map((seg, i) => (
              <Text key={i} style={seg.weight === 'semibold' ? bodySemiboldStyle : undefined}>
                {seg.text}
              </Text>
            ))}
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
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <Text style={titleStyle}>Who We Are?</Text>
      </View>

      {/* 개발팀 카드 — 좌/우 교차 */}
      {developers.map((dev, idx) => (
        <View key={dev.id} style={{ marginBottom: 48 }}>
          <DeveloperCard developer={dev} side={idx % 2 === 0 ? 'left' : 'right'} />
        </View>
      ))}

      {/* 한마디 — 백엔드 미정 placeholder. onGuestbookSubmit 으로 endpoint 연결 */}
      <GuestbookForm onSubmit={onGuestbookSubmit} />
    </View>
  );
}
