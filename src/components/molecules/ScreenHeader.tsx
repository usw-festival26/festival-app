/**
 * ScreenHeader - 공통 화면 헤더 (61px 기본, subHeader 있으면 확장)
 *
 * 모든 탭 화면이 공유하는 단일 헤더. BackdropScreenTemplate 도 내부에서 이를 사용한다.
 * Figma 기준 height 105 → SafeAreaView 가 상태바(44)를 흡수하는 현 구조에선 61 로 축소.
 * subHeader(지도 칩 등)가 주어지면 header bg 가 아래로 확장되어 하나의 라운드 컨테이너로 묶인다.
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { RobotoBlackText } from '../atoms/RobotoBlackText';

export interface ScreenHeaderProps {
  title?: string;
  leftAction?: 'hamburger' | 'back' | 'none';
  /** 헤더 배경 색 (default #F0F0F0). 라인업/정보/메뉴 등 화면 별로 오버라이드. */
  bgColor?: string;
  /** 제목/우측 라벨 텍스트 색 (default #02015B). */
  textColor?: string;
  /** 우측 라벨 (default 'LOGO'). */
  rightLabel?: string;
  /** 좌측 아이콘 자리를 커스텀 노드로 대체. leftAction 을 무시. */
  leftSlot?: React.ReactNode;
  /**
   * 상단 바(61px) 아래에 같은 배경·라운드 안에 들어가는 보조 영역.
   * Figma 920:3931 의 지도 화면처럼 헤더가 두 줄 구조인 경우 사용한다.
   */
  subHeader?: React.ReactNode;
}

export function ScreenHeader({
  title,
  leftAction = 'hamburger',
  bgColor = '#F0F0F0',
  textColor = '#02015B',
  rightLabel = 'LOGO',
  leftSlot,
  subHeader,
}: ScreenHeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 16.8,
        elevation: 6,
        zIndex: 2,
      }}
    >
      {/* 상단 바 — 햄버거/제목/LOGO (Figma 61px) */}
      <View style={{ height: 61, position: 'relative' }}>
        {leftSlot ? (
          <View style={{ position: 'absolute', left: 16, top: 17, width: 30, height: 30 }}>
            {leftSlot}
          </View>
        ) : leftAction === 'hamburger' ? (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            accessibilityRole="button"
            accessibilityLabel="메뉴 열기"
            style={{
              position: 'absolute',
              left: 16,
              top: 17,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="active:opacity-70"
          >
            <Ionicons name="menu" size={28} color={textColor} />
          </Pressable>
        ) : leftAction === 'back' ? (
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
            style={{
              position: 'absolute',
              left: 16,
              top: 17,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="active:opacity-70"
          >
            <Ionicons name="chevron-back" size={28} color={textColor} />
          </Pressable>
        ) : null}

        {title ? (
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: 0, right: 0, top: 23 }}
          >
            <RobotoBlackText size={20} lineHeight={23} color={textColor}>
              {title}
            </RobotoBlackText>
          </View>
        ) : null}

        <View
          pointerEvents="none"
          style={{ position: 'absolute', right: 24, top: 23 }}
        >
          <RobotoBlackText size={20} lineHeight={23} color={textColor}>
            {rightLabel}
          </RobotoBlackText>
        </View>
      </View>

      {/* 보조 영역 — Figma 지도 칩 row (paddingTop 6, paddingBottom 15) */}
      {subHeader ? (
        <View style={{ paddingTop: 6, paddingBottom: 15, alignItems: 'center' }}>
          {subHeader}
        </View>
      ) : null}
    </View>
  );
}
