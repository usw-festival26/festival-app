/**
 * BackdropScreenTemplate - 네이비 배경 + ScreenBackdrop + #F0F0F0 105px 헤더
 *
 * 부스/공지/분실물/라인업/부스 상세가 공유하는 껍데기.
 * 헤더: 좌측 햄버거(또는 leftSlot 교체) + 중앙 제목 + 우측 LOGO 라벨.
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { RobotoBlackText } from '../atoms/RobotoBlackText';
import { ScreenBackdrop, type ScreenBackdropVariant } from '../atoms/ScreenBackdrop';

export interface BackdropScreenTemplateProps {
  title: string;
  backdropVariant: ScreenBackdropVariant;
  rightLabel?: string;
  onMenuPress?: () => void;
  leftSlot?: React.ReactNode;
  headerBg?: string;
  headerTextColor?: string;
  children: React.ReactNode;
}

export function BackdropScreenTemplate({
  title,
  backdropVariant,
  rightLabel = 'LOGO',
  onMenuPress,
  leftSlot,
  headerBg = '#F0F0F0',
  headerTextColor = '#02015B',
  children,
}: BackdropScreenTemplateProps) {
  const navigation = useNavigation();
  const handleMenu = onMenuPress ?? (() => navigation.dispatch(DrawerActions.openDrawer()));

  return (
    <SafeAreaView className="flex-1 bg-festival-primary-dark" edges={['top']}>
      <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <ScreenBackdrop variant={backdropVariant} />

        {/*
          Figma 좌표는 프레임 최상단(상태바 포함) 기준이라 SafeAreaView가 상태바를 이미 처리하는
          현 구조에선 44px 뺀 값을 사용해야 위치가 맞다.
          header height: 105 → 61, hamburger top: 61 → 17, title/right top: 67 → 23.
        */}
        <View
          style={{
            height: 61,
            backgroundColor: headerBg,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 16.8,
            elevation: 6,
          }}
        >
          {leftSlot ? (
            <View style={{ position: 'absolute', left: 16, top: 17, width: 30, height: 30 }}>
              {leftSlot}
            </View>
          ) : (
            <Pressable
              onPress={handleMenu}
              style={{ position: 'absolute', left: 16, top: 17, width: 30, height: 30 }}
              className="items-center justify-center active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="메뉴 열기"
            >
              <Ionicons name="menu" size={28} color={headerTextColor} />
            </Pressable>
          )}

          {/* 제목 래퍼가 left:0 right:0로 햄버거 위에 깔려 터치를 가로채므로 pointerEvents="none" 필수 */}
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: 0, right: 0, top: 23 }}
          >
            <RobotoBlackText size={20} lineHeight={23} color={headerTextColor}>
              {title}
            </RobotoBlackText>
          </View>

          <View
            pointerEvents="none"
            style={{ position: 'absolute', right: 24, top: 23 }}
          >
            <RobotoBlackText size={20} lineHeight={23} color={headerTextColor}>
              {rightLabel}
            </RobotoBlackText>
          </View>
        </View>

        {children}
      </View>
    </SafeAreaView>
  );
}
