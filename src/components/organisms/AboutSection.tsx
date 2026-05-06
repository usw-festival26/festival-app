/**
 * AboutSection - 홈 About Us (Figma 1334:802)
 *
 * 라벨 중앙 Roboto Black 20 white, 카드 368×254 rounded-12 흰색.
 * Figma에선 Information 그라디언트 버튼(321×35)이 카드 내부 하단에 겹쳐 배치됨
 * (카드 y:1241-1495, 버튼 y:1440-1475) → 카드 paddingBottom:20, 하단에 버튼 렌더.
 */
import React from 'react';
import { View, Text, Pressable, Platform, Linking } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { RobotoBlackText } from '../atoms/RobotoBlackText';
import { CONTACT_INFO } from '@data/contact';

export interface AboutSectionProps {
  title?: string;
}

export function AboutSection({ title = 'About Us' }: AboutSectionProps) {
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
            width: 368,
            // height 고정 제거 — 본문이 길어져 잘리지 않도록 content 기반.
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            paddingTop: 24,
            paddingHorizontal: 24,
            paddingBottom: 20,
          }}
        >
          <View style={{ marginBottom: 20 }}>
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
                  if (CONTACT_INFO.kakaoChannelUrl) Linking.openURL(CONTACT_INFO.kakaoChannelUrl);
                }}
                accessibilityRole="link"
                accessibilityLabel="카카오톡 문의 채널 열기"
                style={{
                  color: '#0068FF',
                  textDecorationLine: 'underline',
                }}
              >
                [카카오톡 채널]
              </Text>
              {'을 통해 문의 바랍니다.'}
            </Text>
          </View>

          {/* Information 그라디언트 버튼 — 수평 secondary 팔레트 (#A5FFF3 → #0068FF) +
              navy 텍스트 (이미지 시안) */}
          <View style={{ alignItems: 'center' }}>
            <Pressable
              onPress={() => router.push('/(tabs)/information' as any)}
              style={{ width: 321, height: 35 }}
              className="active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Information 페이지 열기"
            >
              <Svg width={321} height={35} style={{ position: 'absolute', top: 0, left: 0 }}>
                <Defs>
                  <LinearGradient id="infoGrad" x1="0" y1="0.5" x2="1" y2="0.5">
                    <Stop offset="0" stopColor="#A5FFF3" />
                    <Stop offset="1" stopColor="#0068FF" />
                  </LinearGradient>
                </Defs>
                <Rect x={0} y={0} width={321} height={35} rx={17.5} ry={17.5} fill="url(#infoGrad)" />
              </Svg>
              <View
                pointerEvents="none"
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text
                  style={{
                    fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' }),
                    fontWeight: '600',
                    fontSize: 15,
                    color: '#001E56',
                  }}
                >
                  Information
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
