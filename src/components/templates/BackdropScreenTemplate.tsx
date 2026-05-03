/**
 * BackdropScreenTemplate - 네이비 배경 + ScreenBackdrop + 공용 ScreenHeader
 *
 * 부스/공지/분실물/라인업/Information/이벤트/메뉴/타임테이블이 공유하는 껍데기.
 * 헤더는 molecules/ScreenHeader 에 위임 (전 화면 동일 헤더 메트릭 보장).
 */
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../molecules/ScreenHeader';
import { ScreenBackdrop, type ScreenBackdropVariant } from '../atoms/ScreenBackdrop';
import { Colors } from '../../constants/colors';

export interface BackdropScreenTemplateProps {
  title: string;
  backdropVariant: ScreenBackdropVariant;
  rightLabel?: string;
  leftAction?: 'hamburger' | 'back' | 'none';
  leftSlot?: React.ReactNode;
  headerBg?: string;
  headerTextColor?: string;
  /** 헤더 상단 바 아래, 같은 배경 안에 들어가는 보조 영역(예: 지도 카테고리 칩). */
  headerSubHeader?: React.ReactNode;
  /**
   * 화면(SafeAreaView) 배경 hex. ScreenBackdrop blob 들이 이 색 위에 그려진다.
   * 기본값은 festival.primary-dark (네이비). 지도 화면 등 별도 톤이 필요하면 override.
   */
  screenBg?: string;
  children: React.ReactNode;
}

export function BackdropScreenTemplate({
  title,
  backdropVariant,
  rightLabel = 'LOGO',
  leftAction = 'hamburger',
  leftSlot,
  headerBg = '#FFFFFF',
  headerTextColor = '#000000',
  headerSubHeader,
  screenBg = Colors.festival.primaryDark,
  children,
}: BackdropScreenTemplateProps) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: screenBg }}
      edges={['top', 'bottom']}
    >
      <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <ScreenBackdrop variant={backdropVariant} />

        <ScreenHeader
          title={title}
          leftAction={leftAction}
          leftSlot={leftSlot}
          bgColor={headerBg}
          textColor={headerTextColor}
          rightLabel={rightLabel}
          subHeader={headerSubHeader}
        />

        {children}
      </View>
    </SafeAreaView>
  );
}
