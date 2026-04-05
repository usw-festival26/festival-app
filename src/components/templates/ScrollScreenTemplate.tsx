/**
 * ScrollScreenTemplate - 스크롤 가능한 페이지 레이아웃
 *
 * @example
 * <ScrollScreenTemplate title="부스 상세">
 *   <BoothDetail booth={booth} />
 * </ScrollScreenTemplate>
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, type ScreenHeaderProps } from '../molecules/ScreenHeader';

export interface ScrollScreenTemplateProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  leftAction?: ScreenHeaderProps['leftAction'];
}

export function ScrollScreenTemplate({
  title,
  children,
  className = '',
  showHeader = true,
  leftAction,
}: ScrollScreenTemplateProps) {
  return (
    <SafeAreaView className="flex-1 bg-festival-bg" edges={['top']}>
      {showHeader && <ScreenHeader title={title} leftAction={leftAction} />}
      <ScrollView className={`flex-1 ${className}`}>{children}</ScrollView>
    </SafeAreaView>
  );
}
