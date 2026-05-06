/**
 * 추가정보 화면 - Figma 1228:1182
 *
 * 흰색 헤더 + 네이비 백드롭 + 3개 blob 카드(About / History / Who We Are?).
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { BackdropScreenTemplate } from '../../src/components/templates/BackdropScreenTemplate';
import { InformationContent } from '../../src/components/organisms/InformationContent';
import { useInformation } from '../../src/hooks/useInformation';

export default function InformationScreen() {
  const { sections } = useInformation();

  return (
    <BackdropScreenTemplate
      title="Information"
      backdropVariant="information"
      headerBg="#FFFFFF"
      headerTextColor="#000000"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <InformationContent sections={sections} />
      </ScrollView>
    </BackdropScreenTemplate>
  );
}
