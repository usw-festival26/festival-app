/**
 * LineupList - 라인업 화면 본문 (Figma 1014:465)
 *
 * 헤딩 + 블롭 카드 세로 스택. 카드별 tail 위치가 번갈아 바뀐다:
 * 짝수 index → 좌하 각짐(텍스트 우측), 홀수 index → 우하 각짐(텍스트 좌측).
 *
 * day prop — 타임테이블에서 'N일차 라인업 보기' 로 진입했을 때 1 또는 2.
 * 헤딩 라벨이 'Festival Lineup' → 'N일차 아티스트' 로 바뀐다 (데이터는 동일 리스트).
 */
import { AppText } from '@atoms/AppText';
import { ArtistCard } from '@molecules/ArtistCard';
import React from 'react';
import { Platform, View } from 'react-native';
import type { Artist } from '../../types/lineup';

export interface LineupListProps {
  artists: Artist[];
  /** 타임테이블 진입점 컨텍스트 — 1 또는 2 일 때 헤딩 라벨 변경. */
  day?: 1 | 2;
}

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });
const PRETENDARD_BLACK = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Black' });

export function LineupList({ artists, day }: LineupListProps) {
  // day 가 들어오면 한글 헤딩 + 그 일차 아티스트만 필터.
  // 양일/미정 (day 미설정) 아티스트는 day 진입점에서 제외 — 명확한 컨텍스트 우선.
  const heading = day ? `${day}일차 아티스트` : 'Festival Lineup';
  const headingFontFamily = day ? PRETENDARD_BLACK : ROBOTO_BLACK;
  const visibleArtists = day ? artists.filter((a) => a.day === day) : artists;

  return (
    <View style={{ paddingTop: 24, paddingBottom: 40, alignItems: 'center' }}>
      <AppText
        style={{
          fontFamily: headingFontFamily,
          fontWeight: '900',
          fontSize: 32,
          lineHeight: 45,
          color: '#010070',
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        {heading}
      </AppText>

      <View style={{ gap: 40, alignItems: 'center' }}>
        {visibleArtists.map((a, idx) => (
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
          color: '#010070',
          marginTop: 32,
        }}
      >
        ...
      </AppText>
    </View>
  );
}
