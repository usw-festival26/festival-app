/**
 * BoothDetail - 부스 상세 (Figma 964:663)
 *
 * 네이비 배경 + ScreenBackdrop + 흰 solid 카드 1장 (368, rounded-20):
 *  - 상단: 뒤로가기 + 부스명(조직명) 센터
 *  - 썸네일(좌 165×181 흰 + 검정 보더, 이미지 없으면 'Location In Map or Poster') + 부스 안내(우)
 *  - Main / Side / Set 세로 스택, 섹션 라벨 센터(Roboto Black 20 #010070) — MenuSection molecule 재사용
 *  - 섹션 사이 가로 구분선
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Image, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Booth, BoothMenuItem } from '../../types/booth';
import { MenuSection } from '@molecules/MenuSection';
import { ImageLightbox, type ImageLightboxSubject } from '@molecules/ImageLightbox';
import { safeImageSource } from '@utils/imageSource';

export interface BoothDetailProps {
  booth: Booth;
  /**
   * 부스 메뉴. API 모드에서는 부스 detail 응답이 메뉴를 포함하지 않으므로
   * 호출 측이 useBoothMenus(boothId)로 따로 받아 전달한다.
   * 미전달 시 booth.menuItems(하드코딩 fixture) 로 fallback.
   */
  menus?: BoothMenuItem[];
}

const CARD_WIDTH = 368;

const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

/**
 * 메뉴를 isAvailable 기준으로 둘로 나눔. Figma 2205:683 시안 — Main/Side/Set
 * 카테고리 구분 폐기, 가용/품절만 분리.
 */
function splitByAvailability(items: BoothMenuItem[]) {
  const available: BoothMenuItem[] = [];
  const soldOut: BoothMenuItem[] = [];
  items.forEach((i) => {
    if (i.isAvailable === false) soldOut.push(i);
    else available.push(i);
  });
  return { available, soldOut };
}

export function BoothDetail({ booth, menus }: BoothDetailProps) {
  const router = useRouter();
  const { available, soldOut } = splitByAvailability(menus ?? booth.menuItems ?? []);
  const thumbSource = safeImageSource(booth.imageUri);
  const [lightboxSubject, setLightboxSubject] = useState<ImageLightboxSubject | null>(null);

  const openBoothLightbox = () => {
    if (!booth.imageUri) return;
    setLightboxSubject({ id: booth.id, title: booth.name, imageUri: booth.imageUri });
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 24, paddingBottom: 40 }}>
      <View style={styles.card}>
        {/* 상단 바: 뒤로가기 + 조직명 센터 */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
            style={styles.backBtn}
            className="active:opacity-70"
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {/* Figma 135:134 — 카드 상단 가운데에 부스명(='○○○학부' 위치) 노출.
                백엔드 booth.name 이 학부명(예: '컴퓨터소프트웨어학과') 으로 들어옴. */}
            <Text style={styles.boothName}>{booth.name}</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        {/* 썸네일(좌) + 부스 안내(우) */}
        <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 17, marginTop: 10 }}>
          {thumbSource ? (
            <Pressable
              onPress={openBoothLightbox}
              accessibilityRole="button"
              accessibilityLabel={`${booth.name} 사진 자세히 보기`}
              className="w-[165px] h-[181px] rounded-[20px] border border-black bg-white overflow-hidden items-center justify-center active:opacity-[0.85]"
            >
              <Image
                source={thumbSource}
                className="w-full h-full"
                resizeMode="cover"
              />
            </Pressable>
          ) : (
            <View className="w-[165px] h-[181px] rounded-[20px] border border-black bg-white overflow-hidden items-center justify-center">
              <Text style={styles.thumbPlaceholder}>
                {'지도 위치\n또는\n포스터'}
              </Text>
            </View>
          )}

          <View style={{ flex: 1, paddingTop: 15 }}>
            <Text style={styles.sideTitle}>부스 안내</Text>
            <Text style={styles.sideBody}>{booth.description}</Text>
          </View>
        </View>

        {/* 메뉴 섹션 — 'Menu' (가용) 위, 구분선, 'Sold out' (품절) 아래 */}
        <View style={{ marginTop: 32 }}>
          {available.length > 0 ? (
            <View style={{ paddingHorizontal: 36 }}>
              <MenuSection label="Menu" items={available} align="center" labelColor="#001E56" />
            </View>
          ) : null}
          {available.length > 0 && soldOut.length > 0 ? (
            <View style={{ paddingHorizontal: 16 }}>
              <View style={styles.divider} />
            </View>
          ) : null}
          {soldOut.length > 0 ? (
            <View style={{ paddingHorizontal: 36 }}>
              <MenuSection label="Sold out" items={soldOut} align="center" labelColor="#560001" />
            </View>
          ) : null}
        </View>

        <View style={{ height: 24 }} />
      </View>

      <ImageLightbox subject={lightboxSubject} onClose={() => setLightboxSubject(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingTop: 18,
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boothName: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
  },
  // styles.thumb 는 className 으로 이전 (NativeWind 가이드라인 정합).
  thumbPlaceholder: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
  },
  sideTitle: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
    marginBottom: 10,
  },
  sideBody: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#000000',
    lineHeight: 18,
  },
  divider: {
    // Figma 2205:683 — 메뉴 마지막 아이템 → 구분선 까지 큰 여백, 구분선 → Sold out 라벨 27px.
    // 라인 자체는 옅은 회색. 이전엔 marginTop 0 이라 마지막 아이템 underline 처럼 보였음.
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000000',
    marginTop: 32,
    marginBottom: 27,
    opacity: 0.2,
  },
});
