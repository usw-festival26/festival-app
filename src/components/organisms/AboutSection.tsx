/**
 * AboutSection - 홈 About Us (Figma 1334:802)
 *
 * 라벨 중앙 Roboto Black 20 white, 카드 368×254 rounded-12 흰색.
 * Figma에선 Information 그라디언트 버튼(321×35)이 카드 내부 하단에 겹쳐 배치됨
 * (카드 y:1241-1495, 버튼 y:1440-1475) → 카드 paddingBottom:20, 하단에 버튼 렌더.
 */
import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { RobotoBlackText } from '../atoms/RobotoBlackText';

export interface AboutSectionProps {
  title?: string;
}

export function AboutSection({ title = 'About Us' }: AboutSectionProps) {
  const router = useRouter();

  return (
    <View style={{ paddingTop: 41, paddingBottom: 32 }}>
      <View style={{ marginBottom: 16 }}>
        <RobotoBlackText size={20} lineHeight={23} color="#FFFFFF">
          {title}
        </RobotoBlackText>
      </View>
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 368,
            height: 254,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            paddingTop: 24,
            paddingHorizontal: 24,
            paddingBottom: 20,
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' }),
                fontWeight: '600',
                fontSize: 15,
                color: '#02015B',
                marginBottom: 8,
              }}
            >
              수원대학교 대동제에 오신 것을 환영합니다
            </Text>
            <Text
              style={{
                fontFamily: Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' }),
                fontSize: 12,
                lineHeight: 18,
                color: '#3F3F5C',
              }}
            >
              학생, 교직원, 지역 주민 모두가 함께 즐기는 축제입니다. 다양한 부스, 공연, 먹거리가 준비되어 있으니 많은 관심과 참여 부탁드립니다.
            </Text>
          </View>

          {/* Information 그라디언트 버튼 (Figma 1334:809 — 321×35, -5.76deg, #0D00FF 13.5% → #FFBEBF 84.6%) */}
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
                  <LinearGradient id="infoGrad" x1="0.55" y1="1" x2="0.45" y2="0">
                    <Stop offset="13.548%" stopColor="#0D00FF" />
                    <Stop offset="84.597%" stopColor="#FFBEBF" />
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
                    color: '#FFFFFF',
                  }}
                >
                  Imformation
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
