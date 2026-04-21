/**
 * ArtistCard - 라인업 아티스트 카드 (Figma 1014:489-491)
 *
 * 274×269 흰 blob 카드 — 4개 모서리 중 1개(tail)만 10px 각지고 나머지는 134.5px 둥근 형태.
 * 카드 아래 opposite 측면에 아티스트명/Information 텍스트를 배치.
 */
import React from 'react';
import { View, Platform } from 'react-native';
import { AppText } from '@atoms/AppText';
import type { Artist } from '../../types/lineup';

/** 각진(꼭지) 모서리 위치 — 'left' = 좌하, 'right' = 우하 */
export type ArtistCardTail = 'left' | 'right';

export interface ArtistCardProps {
  artist: Artist;
  tail: ArtistCardTail;
}

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

export function ArtistCard({ artist, tail }: ArtistCardProps) {
  const radius = 134.5;
  const squared = 10;

  const cardRadii =
    tail === 'left'
      ? {
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: squared,
          borderBottomRightRadius: radius,
        }
      : {
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: squared,
        };

  // 텍스트는 tail 반대편에 정렬
  const labelAlign = tail === 'left' ? 'flex-end' : 'flex-start';
  const textAlign = tail === 'left' ? ('right' as const) : ('left' as const);

  return (
    <View style={{ width: 274, alignItems: labelAlign }}>
      <View
        style={[
          { width: 274, height: 269, backgroundColor: '#FFFFFF' },
          cardRadii,
        ]}
      />
      <View style={{ marginTop: 10, paddingHorizontal: 4 }}>
        <AppText
          style={{
            fontFamily: ROBOTO_BLACK,
            fontWeight: '900',
            fontSize: 20,
            lineHeight: 23,
            color: '#FFFFFF',
            textAlign,
          }}
        >
          {artist.name}
        </AppText>
        <AppText
          style={{
            fontFamily: 'Pretendard-Regular',
            fontSize: 12,
            color: '#FFFFFF',
            textAlign,
            marginTop: 2,
          }}
        >
          {artist.info}
        </AppText>
      </View>
    </View>
  );
}
