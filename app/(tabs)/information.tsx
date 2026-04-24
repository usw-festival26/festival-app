/**
 * 추가정보 화면 - Figma 1228:1182
 *
 * 흰색 헤더 + 네이비 백드롭 + 3개 blob 카드(About / History / Who We Are?).
 * "Imformation" 표기는 Figma 원문 유지(AboutSection의 타이포와 통일).
 */
import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { BackdropScreenTemplate } from '../../src/components/templates/BackdropScreenTemplate';
import { InformationContent } from '../../src/components/organisms/InformationContent';
import { EmptyState } from '../../src/components/molecules/EmptyState';
import { useInformation } from '../../src/hooks/useInformation';

export default function InformationScreen() {
  const { sections, isLoading, error } = useInformation();

  return (
    <BackdropScreenTemplate
      title="Imformation"
      backdropVariant="information"
      headerBg="#FFFFFF"
      headerTextColor="#000000"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {isLoading ? (
          <View style={{ paddingVertical: 48, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#02015B" />
          </View>
        ) : error ? (
          <EmptyState
            message={`정보를 불러오지 못했습니다.\n${error}`}
            iconName="alert-circle-outline"
          />
        ) : (
          <InformationContent sections={sections} />
        )}
      </ScrollView>
    </BackdropScreenTemplate>
  );
}
