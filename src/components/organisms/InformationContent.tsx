/**
 * InformationContent - Information 화면 본문 (Figma 2304:629)
 *
 * 구조 (flex column 자연 흐름):
 *   About 카드 → "Who We Are?" 타이틀 → 개발팀 7명 카드 (좌/우 교차)
 *
 * 곡률 patterns (Figma 그대로):
 *   - About 카드: 107.5 / 107.5 / 107.5 / 10
 *   - 카드 1·2 (주호연·남주연):  71.5 / 71.5 / 10 / 71.5  (DeveloperCard variant='rounded')
 *   - 카드 3~7 (최민서·최재령·안혜선·김회윤·정소윤): 114 / 71.5 / 10 / 114 (variant='extended')
 *
 * 카드 row height 167 (사진이 카드 bottom 보다 24 아래로 overflow), 카드 사이
 * marginBottom 24 → 시각 gap = 24 (Figma 의도 그대로).
 *
 * GradientBlob 4개는 카드와 분리된 absolute layer. 헤더 105 + paddingTop 18
 * 보정 후 root 의 absolute top 산출.
 *
 * About 본문은 segments(text+weight) 로 받아 weight 별 fontFamily 분기.
 * 인스타그램/사이트는 인라인 Pressable — Linking 가드 후 openURL.
 */
import { GradientBlob } from '@components/atoms';
import { DeveloperCard } from '@components/molecules';
import type { AboutBodySegment } from '@hooks';
import type { Developer } from '@types';
import React from 'react';
import { Linking, Platform, Text, View } from 'react-native';

const PRETENDARD_BLACK = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Black' });
const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

// 색
const TITLE_COLOR = '#0068FF';
const BODY_COLOR = '#001E56';
const LINK_COLOR = '#0068FF';

// 헤더 offset — BackdropScreenTemplate 의 ScreenHeader 높이.
// blob 의 absolute top 산출 시 (figma_top - HEADER_OFFSET) 으로.
const HEADER_OFFSET = 105;
const ROOT_PADDING_TOP = 18;

const titleStyle = {
  fontFamily: PRETENDARD_BLACK,
  fontWeight: '900' as const,
  fontSize: 22,
  lineHeight: 26,
  color: TITLE_COLOR,
  letterSpacing: -0.5,
  textAlign: 'center' as const,
};

const bodyStyle = {
  fontFamily: PRETENDARD_REGULAR,
  fontSize: 12,
  lineHeight: 19,
  color: BODY_COLOR,
  textAlign: 'center' as const,
  letterSpacing: -0.3,
};

const bodySemiboldStyle = {
  fontFamily: PRETENDARD_SEMIBOLD,
  fontWeight: '600' as const,
};

const linkStyle = {
  color: LINK_COLOR,
  textDecorationLine: 'underline' as const,
};

async function openExternal(url: string) {
  try {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  } catch {
    // 외부 앱 미설치/차단 — silent noop
  }
}

export interface InformationContentProps {
  aboutSegments: ReadonlyArray<AboutBodySegment>;
  instagramUrl: string;
  siteUrl: string;
  developers: Developer[];
}

export function InformationContent({
  aboutSegments,
  instagramUrl,
  siteUrl,
  developers,
}: InformationContentProps) {
  return (
    <View
      style={{
        paddingTop: ROOT_PADDING_TOP,
        // 마지막 GradientBlob (ellipse 71, figma top:1842 + rotate 56.4 +
        // image inset -30.42%) 의 visual extent 가 마지막 카드(정소윤) 보다
        // ~370px 더 아래까지. overflow:'hidden' 안에서 잘리지 않도록 root
        // paddingBottom 충분히 확보.
        paddingBottom: 360,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 장식 GradientBlob — flow 자식 뒤로 깔리도록 가장 먼저 렌더.
          좌표는 Figma 절대 좌표(figma_top) 에서 헤더 105 빼서 root absolute top. */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 586 - HEADER_OFFSET, left: 296 }}>
        <GradientBlob size={154} />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 960 - HEADER_OFFSET, left: 0 }}>
        <GradientBlob size={92} rotate={90} reversed />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 1357 - HEADER_OFFSET, left: 283 }}>
        <GradientBlob size={289} />
      </View>
      <View pointerEvents="none" style={{ position: 'absolute', top: 1842 - HEADER_OFFSET, left: -123 }}>
        <GradientBlob size={329} rotate={56.4} />
      </View>

      {/* About 카드 — Figma 368×572 (minHeight, 본문 길이에 따라 자연 확장) */}
      <View
        style={{
          width: 368,
          minHeight: 572,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 107.5,
          borderTopRightRadius: 107.5,
          borderBottomRightRadius: 107.5,
          borderBottomLeftRadius: 10,
          alignSelf: 'center',
          paddingTop: 58,
          paddingBottom: 36,
          paddingHorizontal: 24,
          marginBottom: 45,
        }}
      >
        <Text style={titleStyle}>About</Text>
        <Text style={[bodyStyle, { width: 320, alignSelf: 'center', marginTop: 7 }]}>
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

      {/* "Who We Are?" 타이틀 */}
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <Text style={titleStyle}>Who We Are?</Text>
      </View>

      {/* 개발팀 카드 — 좌/우 교차. 모든 카드 동일 곡률(rounded, 주호연 패턴) 통일.
          사진은 row 안 vertical center 라 카드 outside 로 튀어나오지 않음.
          마지막 카드(정소윤) 도 동일 marginBottom 24 — root paddingBottom 으로
          마지막 blob 공간 확보하므로 마지막 카드만 마진 0 으로 둘 필요 없음. */}
      {developers.map((dev, idx) => (
        <View key={dev.id} style={{ marginBottom: 24 }}>
          <DeveloperCard
            developer={dev}
            side={idx % 2 === 0 ? 'left' : 'right'}
            variant="rounded"
          />
        </View>
      ))}
    </View>
  );
}
