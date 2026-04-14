/**
 * ListScreenTemplate - 목록형 페이지 레이아웃
 *
 * @example
 * <ListScreenTemplate title="부스">
 *   <BoothList booths={booths} />
 * </ListScreenTemplate>
 */
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../molecules/ScreenHeader';

export interface ListScreenTemplateProps {
  title?: string;
  children: React.ReactNode;
  showHeader?: boolean;
}

export function ListScreenTemplate({ title, children, showHeader = true }: ListScreenTemplateProps) {
  return (
    <SafeAreaView className="flex-1 bg-festival-primary-dark" edges={['top']}>
      {showHeader && <ScreenHeader title={title} />}
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
