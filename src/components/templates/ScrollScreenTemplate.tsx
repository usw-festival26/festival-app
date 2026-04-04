/**
 * ScrollScreenTemplate - 스크롤 가능한 페이지 레이아웃
 *
 * @example
 * <ScrollScreenTemplate title="부스 상세">
 *   <BoothDetail booth={booth} />
 * </ScrollScreenTemplate>
 */
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../molecules/ScreenHeader';

export interface ScrollScreenTemplateProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
}

export function ScrollScreenTemplate({
  title,
  children,
  className = '',
  showHeader = true,
}: ScrollScreenTemplateProps) {
  return (
    <SafeAreaView className="flex-1 bg-festival-bg" edges={['top']}>
      {showHeader && <ScreenHeader title={title} />}
      <ScrollView className={`flex-1 ${className}`}>{children}</ScrollView>
    </SafeAreaView>
  );
}
