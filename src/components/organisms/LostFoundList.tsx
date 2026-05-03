/**
 * LostFoundList - 분실물 안내 화면 (Figma 1926:860)
 *
 * 기존 카드 리스트/카테고리 칩 시스템은 폐기. 축제 종료 후 업로드 안내 + 사진
 * 캐러셀 placeholder 만 표시. 향후 실제 사진이 들어오면 placeholder 자리에 캐러셀
 * 연결 (현재는 정적 1/3 표기).
 *
 * 레이아웃
 *  - 네이비 배경 상단: FaqBubble + "문의 · 카카오톡 채널"
 *  - 반투명 흰 패널(rounded 20): 안내 문구 + 흰 카드 placeholder + 페이지 도트 + "1/3"
 *
 * 스타일링: NativeWind className (CLAUDE.md 규칙). insets 는 런타임 동적 값이라
 * contentContainerStyle 만 인라인 유지.
 */
import React from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FaqBubble } from '@molecules/FaqBubble';
import { CONTACT_INFO } from '@data/contact';

const TOTAL_PAGES = 3;
const ACTIVE_PAGE = 0;

export function LostFoundList() {
  const insets = useSafeAreaInsets();
  const kakaoUrl = CONTACT_INFO.kakaoChannelUrl;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. 네이비 배경 상단: 말풍선 + 문의 라인 */}
      <View className="pt-[34px] pb-[28px] items-center">
        <FaqBubble question="분실물을 습득하셨다면 아래 번호로 연락주세요!" />
        <Pressable
          onPress={() => {
            if (kakaoUrl) Linking.openURL(kakaoUrl);
          }}
          accessibilityRole={kakaoUrl ? 'link' : undefined}
          accessibilityLabel="카카오톡 문의 채널 열기"
          disabled={!kakaoUrl}
          className="flex-row items-center gap-3 mt-[18px] active:opacity-70"
        >
          <Text className="font-pretendard text-[12px] text-white">문의</Text>
          <View className="w-[3px] h-[3px] rounded-full bg-white" />
          <Text className="font-pretendard text-[12px] text-white">
            {CONTACT_INFO.kakaoChannelLabel}
          </Text>
        </Pressable>
      </View>

      {/* 2. 반투명 흰 패널: 안내 + placeholder 캐러셀 */}
      <View className="mx-[18px] bg-white/70 rounded-[20px] pt-[57px] pb-[42px] items-center">
        <Text className="font-pretendard text-[12px] text-black text-center mb-[28px]">
          전체 분실물은 당일 축제가 끝난 후에 업로드됩니다
        </Text>

        {/* 사진 자리 — 실제 데이터 연결 시 캐러셀로 교체 */}
        <View className="w-[292px] h-[395px] bg-white rounded-[5px]" />

        {/* 페이지 인디케이터 도트 */}
        <View className="flex-row gap-2 mt-[13px]">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <View
              key={i}
              className={`w-[6px] h-[6px] rounded-full ${
                i === ACTIVE_PAGE ? 'bg-black' : 'bg-black/20'
              }`}
            />
          ))}
        </View>

        {/* 페이지 표시 */}
        <Text className="font-pretendard font-semibold text-[15px] text-black mt-[6px]">
          {ACTIVE_PAGE + 1}/{TOTAL_PAGES}
        </Text>
      </View>
    </ScrollView>
  );
}
