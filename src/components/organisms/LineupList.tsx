/**
 * LineupList - 라인업 화면 본문
 *
 * Figma 920:4289: 네이비 배경 + "Festival Lineup!" 흰색 32px 헤딩
 * + ArtistCard 세로 스택 + 하단 "..." 인디케이터
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '@atoms/AppText';
import { ArtistCard } from '../molecules/ArtistCard';
import type { Artist } from '../../types/lineup';

export interface LineupListProps {
  artists: Artist[];
}

export function LineupList({ artists }: LineupListProps) {
  return (
    <View className="bg-festival-primary-dark pt-2 pb-10 items-center">
      <AppText className="text-[32px] font-black text-white text-center leading-[45px] mb-4 font-roboto">
        Festival Lineup!
      </AppText>
      <View className="gap-5 items-center">
        {artists.map((a) => (
          <ArtistCard key={a.id} artist={a} />
        ))}
      </View>
      <AppText className="text-[22px] text-white mt-6 font-roboto">...</AppText>
    </View>
  );
}
