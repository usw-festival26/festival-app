/**
 * LostFoundList - 분실물 안내 화면 (Figma 1926:860)
 *
 * 기존 카드 리스트/카테고리 칩 시스템은 폐기. 축제 종료 후 업로드 안내 + 사진
 * 캐러셀 placeholder 만 표시. 향후 실제 사진이 들어오면 placeholder 자리에 캐러셀
 * 연결 (현재는 정적 1/3 표기).
 *
 * 레이아웃
 *  - 네이비 배경 상단: FaqBubble + "문의번호 · 010-1234-5678"
 *  - 반투명 흰 패널(rounded 20): 안내 문구 + 흰 카드 placeholder + 페이지 도트 + "1/3"
 */
import React from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FaqBubble } from '@molecules/FaqBubble';

const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });
const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });

const TOTAL_PAGES = 3;
const ACTIVE_PAGE = 0;

/**
 * 카카오톡 채널 URL — 빈 문자열이면 클릭 비활성. 실제 채널이 정해지면 입력.
 * 형식 예: 'https://pf.kakao.com/_xxxxxx'
 */
const KAKAO_CHANNEL_URL = '';

export function LostFoundList() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. 네이비 배경 상단: 말풍선 + 문의번호 */}
      <View style={{ paddingTop: 34, paddingBottom: 28, alignItems: 'center' }}>
        <FaqBubble question="분실물을 습득하셨다면 아래 번호로 연락주세요!" />
        <Pressable
          onPress={() => {
            if (KAKAO_CHANNEL_URL) Linking.openURL(KAKAO_CHANNEL_URL);
          }}
          accessibilityRole={KAKAO_CHANNEL_URL ? 'link' : undefined}
          accessibilityLabel="카카오톡 문의 채널 열기"
          disabled={!KAKAO_CHANNEL_URL}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginTop: 18,
            opacity: pressed && KAKAO_CHANNEL_URL ? 0.7 : 1,
          })}
        >
          <Text style={styles.contactLabel}>문의</Text>
          <View style={styles.dotDivider} />
          <Text style={styles.contactValue}>카카오톡 채널</Text>
        </Pressable>
      </View>

      {/* 2. 반투명 흰 패널: 안내 + placeholder 캐러셀 */}
      <View
        style={{
          marginHorizontal: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 20,
          paddingTop: 57,
          paddingBottom: 42,
          alignItems: 'center',
        }}
      >
        <Text style={styles.notice}>전체 분실물은 당일 축제가 끝난 후에 업로드됩니다</Text>

        {/* 사진 자리 — 실제 데이터 연결 시 캐러셀로 교체 */}
        <View style={styles.photoPlaceholder} />

        {/* 페이지 인디케이터 도트 */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 13 }}>
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === ACTIVE_PAGE && styles.dotActive]}
            />
          ))}
        </View>

        {/* 페이지 표시 */}
        <Text style={styles.pageIndicator}>
          {ACTIVE_PAGE + 1}/{TOTAL_PAGES}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contactLabel: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  contactValue: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  dotDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  notice: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 28,
  },
  photoPlaceholder: {
    width: 292,
    height: 395,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dotActive: {
    backgroundColor: '#000000',
  },
  pageIndicator: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
    marginTop: 6,
  },
});
