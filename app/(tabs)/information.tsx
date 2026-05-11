/**
 * 추가정보 화면 - Figma 2304:629
 *
 * 흰색 헤더 + 네이비 백드롭 + About 카드 + Who We Are? + 개발팀 7명 카드.
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { BackdropScreenTemplate } from '../../src/components/templates/BackdropScreenTemplate';
import { InformationContent } from '../../src/components/organisms/InformationContent';
import { useInformation } from '../../src/hooks/useInformation';

export default function InformationScreen() {
  const { aboutSegments, instagramUrl, siteUrl, developers } = useInformation();

  return (
    <BackdropScreenTemplate
      title="About us"
      backdropVariant="information"
      headerBg="#FFFFFF"
      headerTextColor="#001E56"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <InformationContent
          aboutSegments={aboutSegments}
          instagramUrl={instagramUrl}
          siteUrl={siteUrl}
          developers={developers}
        />
      </ScrollView>
    </BackdropScreenTemplate>
  );
}
