/**
 * ArtistCard - 라인업 아티스트 카드
 *
 * Figma 920:4289: 흰색 카드 272×369 rounded-[20px]
 * 카드 하단 중앙에 흰색 Artist N + Information 텍스트 (이미지 위 오버레이)
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '@atoms/AppText';
import type { Artist } from '../../types/lineup';

export interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <View className="w-[272px] h-[369px] bg-festival-card rounded-[20px] overflow-hidden justify-end items-center pb-[26px]">
      <AppText className="text-[20px] font-black text-white leading-[23px] font-roboto">
        {artist.name}
      </AppText>
      <AppText className="text-[12px] text-white mt-1 font-pretendard">
        {artist.info}
      </AppText>
    </View>
  );
}
