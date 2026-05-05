/**
 * 라인업 화면 - Figma 1014:465
 *
 * BackdropScreenTemplate(흰 헤더 + 검정 텍스트) + "Festival Lineup!" + ArtistCard 스택
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { BackdropScreenTemplate } from '../../src/components/templates/BackdropScreenTemplate';
import { LineupList } from '../../src/components/organisms/LineupList';
import { useLineup } from '../../src/hooks/useLineup';

export default function LineupScreen() {
  const { data } = useLineup();

  return (
    <BackdropScreenTemplate
      title="라인업"
      backdropVariant="lineup"
      headerBg="#FFFFFF"
      headerTextColor="#000000"
    >
      <ScrollView contentContainerStyle={{ paddingTop: 18, paddingHorizontal: 16, paddingBottom: 24 }}>
        <LineupList artists={data} />
      </ScrollView>
    </BackdropScreenTemplate>
  );
}
