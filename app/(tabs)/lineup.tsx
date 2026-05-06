/**
 * 라인업 화면 - Figma 1014:465
 *
 * BackdropScreenTemplate(흰 헤더 + 검정 텍스트) + 헤더 라벨 + ArtistCard 스택.
 *
 * 진입점:
 *  - 직접 진입 (drawer/header) — 헤더 라벨 'Festival Lineup!'
 *  - 타임테이블 "N일차 라인업 보기" 버튼 → ?day=1 또는 ?day=2 query 와 함께
 *    진입 → 헤더 라벨 'N일차 아티스트' 로 컨텍스트 표시. 데이터는 동일 리스트.
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { BackdropScreenTemplate } from '../../src/components/templates/BackdropScreenTemplate';
import { LineupList } from '../../src/components/organisms/LineupList';
import { useLineup } from '../../src/hooks/useLineup';

function parseDayParam(raw: unknown): 1 | 2 | undefined {
  if (raw === '1' || raw === 1) return 1;
  if (raw === '2' || raw === 2) return 2;
  return undefined;
}

export default function LineupScreen() {
  const { data } = useLineup();
  const params = useLocalSearchParams<{ day?: string }>();
  const day = parseDayParam(params.day);

  return (
    <BackdropScreenTemplate
      title="라인업"
      backdropVariant="lineup"
      headerBg="#FFFFFF"
      headerTextColor="#000000"
    >
      <ScrollView contentContainerStyle={{ paddingTop: 18, paddingHorizontal: 16, paddingBottom: 24 }}>
        <LineupList artists={data} day={day} />
      </ScrollView>
    </BackdropScreenTemplate>
  );
}
