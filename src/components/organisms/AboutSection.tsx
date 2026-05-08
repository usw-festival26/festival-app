/**
 * AboutSection - 홈 Information 섹션 (Figma 2139:807 + 2139:760 + 2139:761)
 *
 * 새 시안: 섹션 라벨 "Information" + 흰 카드(368×232, rounded-12) + 카드 외부 하단의
 *   "About Us" 그라디언트 pill 버튼(368×47, rounded-100). 버튼 탭 시 /information 라우트로.
 *
 * 이전 시안 대비 변경:
 *  - 섹션 라벨 텍스트  : "About Us" → "Information"
 *  - pill 버튼 텍스트  : "Information" → "About Us"
 *  - pill 위치        : 카드 내부 하단 → 카드 아래(외부, 18px 간격)
 *  - pill 크기        : 321×35 → 368×47
 *  - pill 텍스트 스타일: Pretendard-SemiBold 15 navy → Roboto Black 20 black
 *
 * 컴포넌트 이름은 호환성 위해 유지(AboutSection). 라우트 navigation 도 그대로 /information.
 */
import React from 'react';
import { View, Text, Pressable, Platform, Linking } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { RobotoBlackText } from '../atoms/RobotoBlackText';
import { CONTACT_INFO } from '@data/contact';
import { Colors } from '@constants/colors';

export interface AboutSectionProps {
  /** 섹션 상단 라벨. 기본 "Information" — 신규 Figma 시안. */
  title?: string;
}

const CARD_WIDTH = 368;
const BUTTON_WIDTH = 368;
const BUTTON_HEIGHT = 47;
const BUTTON_RADIUS = BUTTON_HEIGHT / 2; // pill (Figma rounded-100)
const CARD_TO_BUTTON_GAP = 18; // Figma: card top 1394+232=1626, button top 1644 → 18

export function AboutSection({ title = 'Information' }: AboutSectionProps) {
  const router = useRouter();

  return (
    <View style={{ paddingTop: 41, paddingBottom: 32 }}>
      <View style={{ marginBottom: 16 }}>
        <RobotoBlackText size={20} lineHeight={23} color="#010070">
          {title}
        </RobotoBlackText>
      </View>

      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: CARD_WIDTH,
            // height 고정 제거 — 본문이 길어져 잘리지 않도록 content 기반.
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            paddingVertical: 24,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' }),
              fontWeight: '600',
              fontSize: 15,
              color: '#02015B',
              marginBottom: 8,
            }}
          >
            2026 수원대학교 대동제
          </Text>
          <Text
            style={{
              fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' }),
              fontSize: 12,
              lineHeight: 18,
              color: '#3F3F5C',
            }}
          >
            {'학우 간의 소통과 화합을 위해 기획된 축제입니다.\n다양한 공연, 부스, 이벤트를 통해 즐거운 시간을 보낼 수 있습니다.\n\n📍 일정: 5월 14일 ~ 5월 15일\n⏰ 운영 시간: 12:00 ~ 02:00\n📌 장소: 수원대학교 캠퍼스 일대\n💲 결제 방식: 현금 및 계좌이체\n\n⚠️ 안전하고 즐거운 축제를 위해 질서 유지 및 안전 수칙을 준수해주시기 바랍니다.\n📞 문의: '}
            <Text
              onPress={() => {
                if (CONTACT_INFO.kakaoChannelUrl) {
                  Linking.openURL(CONTACT_INFO.kakaoChannelUrl).catch(() => {});
                }
              }}
              accessibilityRole="link"
              accessibilityLabel="카카오톡 문의 채널 열기"
              style={{
                color: Colors.festival.primary,
                textDecorationLine: 'underline',
              }}
            >
              [카카오톡 채널]
            </Text>
            {'을 통해 문의 바랍니다.'}
          </Text>
        </View>

        {/* About Us pill 버튼 — 카드 외부, 18px 간격 아래에. 그라디언트 #A5FFF3 → #0068FF, Roboto Black 20 black. */}
        <View style={{ marginTop: CARD_TO_BUTTON_GAP }}>
          <Pressable
            onPress={() => router.push('/(tabs)/information' as any)}
            style={{ width: BUTTON_WIDTH, height: BUTTON_HEIGHT }}
            className="active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="About Us 페이지 열기"
          >
            <Svg
              width={BUTTON_WIDTH}
              height={BUTTON_HEIGHT}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <Defs>
                <LinearGradient id="aboutUsGrad" x1="0" y1="0.5" x2="1" y2="0.5">
                  <Stop offset="0" stopColor="#A5FFF3" />
                  <Stop offset="1" stopColor="#0068FF" />
                </LinearGradient>
              </Defs>
              <Rect
                x={0}
                y={0}
                width={BUTTON_WIDTH}
                height={BUTTON_HEIGHT}
                rx={BUTTON_RADIUS}
                ry={BUTTON_RADIUS}
                fill="url(#aboutUsGrad)"
              />
            </Svg>
            <View
              pointerEvents="none"
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
              <RobotoBlackText size={20} lineHeight={23} color="#000000">
                About Us
              </RobotoBlackText>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
