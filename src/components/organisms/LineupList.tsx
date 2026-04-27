/**
 * LineupList - 라인업 화면 본문 (Figma 1014:465)
 *
 * 네이비 배경 + "Festival Lineup!" 32px 헤딩 + 블롭 카드 세로 스택
 * 카드별 tail 위치가 번갈아 바뀐다: 짝수 index → 좌하 각짐(텍스트 우측),
 * 홀수 index → 우하 각짐(텍스트 좌측).
 */
import React from 'react';
import { View, Platform } from 'react-native';
import { AppText } from '@atoms/AppText';
import { ArtistCard } from '@molecules/ArtistCard';
import type { Artist } from '../../types/lineup';

export interface LineupListProps {
  artists: Artist[];
}

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

export function LineupList({ artists }: LineupListProps) {
  return (
    <View style={{ paddingTop: 24, paddingBottom: 40, alignItems: 'center' }}>
      <AppText
        style={{
          fontFamily: ROBOTO_BLACK,
          fontWeight: '900',
          fontSize: 32,
          lineHeight: 45,
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        Festival Lineup!
      </AppText>

      <View style={{ gap: 40, alignItems: 'center' }}>
        {artists.map((a, idx) => (
          <ArtistCard
            key={a.id}
            artist={a}
            tail={idx % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </View>

      <AppText
        style={{
          fontFamily: 'Pretendard-Black',
          fontSize: 22,
          color: '#FFFFFF',
          marginTop: 32,
        }}
      >
        ...
      </AppText>
    </View>
  );
}
