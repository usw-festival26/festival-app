/**
 * BoothDetail - 부스 상세 (Figma 1272:1632)
 *
 * 네이비 배경 + ScreenBackdrop + 흰 그라디언트 큰 카드 1장:
 *  - 상단: 뒤로가기 + 부스명 센터
 *  - 썸네일(좌) + 부스 안내(우)
 *  - Main / Side / Set 세로 스택, 섹션 사이 구분선
 */
import React from 'react';
import { ScrollView, View, Pressable, Image } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Booth, BoothMenuItem } from '../../types/booth';
import { AppText } from '@atoms/AppText';
import { MenuSection } from '@molecules/MenuSection';

export interface BoothDetailProps {
  booth: Booth;
}

const CARD_WIDTH = 368;

function group(items: BoothMenuItem[]) {
  const main: BoothMenuItem[] = [];
  const side: BoothMenuItem[] = [];
  const set: BoothMenuItem[] = [];
  items.forEach((i) => {
    const cat = i.menuCategory ?? 'main';
    if (cat === 'side') side.push(i);
    else if (cat === 'set') set.push(i);
    else main.push(i);
  });
  return { main, side, set };
}

export function BoothDetail({ booth }: BoothDetailProps) {
  const router = useRouter();
  const { main, side, set } = group(booth.menuItems);

  const sections: { label: string; items: BoothMenuItem[] }[] = [
    { label: 'Main', items: main },
    { label: 'Side', items: side },
    { label: 'Set', items: set },
  ].filter((s) => s.items.length > 0);

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 20, paddingBottom: 40 }}>
      <View style={{ width: CARD_WIDTH, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
        {/* 흰 세로 그라디언트 배경 */}
        <Svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient id="booth-detail-grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.95" />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" rx={20} ry={20} fill="url(#booth-detail-grad)" />
        </Svg>

        <View style={{ padding: 20 }}>
          {/* 상단 바: 뒤로가기 + 부스명 센터 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="뒤로 가기"
              style={{ width: 28, height: 28 }}
              className="active:opacity-70"
            >
              <Ionicons name="chevron-back" size={24} color="#02015B" />
            </Pressable>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <AppText
                style={{
                  fontFamily: 'Pretendard-SemiBold',
                  fontSize: 15,
                  color: '#02015B',
                }}
              >
                {booth.organizer}
              </AppText>
            </View>
            <View style={{ width: 28 }} />
          </View>

          {/* 썸네일 + 부스 안내 */}
          <View style={{ flexDirection: 'row', gap: 14, marginBottom: 28 }}>
            <View
              style={{
                width: 160,
                height: 181,
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: '#E8E8F0',
              }}
            >
              {booth.imageUri ? (
                <Image
                  source={{ uri: booth.imageUri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              <AppText
                style={{
                  fontFamily: 'Pretendard-SemiBold',
                  fontSize: 15,
                  color: '#000000',
                  marginBottom: 10,
                }}
              >
                부스 안내
              </AppText>
              <AppText
                style={{
                  fontFamily: 'Pretendard-Regular',
                  fontSize: 12,
                  color: '#000000',
                  lineHeight: 18,
                }}
              >
                {booth.description}
              </AppText>
            </View>
          </View>

          {/* 섹션 스택 */}
          {sections.map((s, idx) => (
            <View key={s.label}>
              {idx > 0 && (
                <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.08)', marginVertical: 18 }} />
              )}
              <MenuSection label={s.label} items={s.items} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
