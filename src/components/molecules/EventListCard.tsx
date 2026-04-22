/**
 * EventListCard - 이벤트 페이지 세로형 카드 (Figma 1590:1116)
 *
 * 274×269 pure white rounded-10 카드. 카드 아래(네이비 배경) 에 흰색 title/description.
 * Figma: 카드 내부엔 이미지/placeholder 만, 텍스트는 카드 외부.
 */
import React from 'react';
import { View, Image, Platform } from 'react-native';
import { AppText } from '@atoms/AppText';

export interface EventListCardProps {
  title: string;
  description: string;
  imageUri?: string;
}

const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

export function EventListCard({ title, description, imageUri }: EventListCardProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: 274,
          height: 269,
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : null}
      </View>

      <View style={{ width: 274, marginTop: 12, alignItems: 'center' }}>
        <AppText
          style={{
            fontFamily: PRETENDARD_SEMIBOLD,
            fontWeight: '600',
            fontSize: 15,
            lineHeight: 20,
            color: '#FFFFFF',
            textAlign: 'center',
          }}
          numberOfLines={1}
        >
          {title}
        </AppText>
        <AppText
          style={{
            fontFamily: PRETENDARD_REGULAR,
            fontWeight: '400',
            fontSize: 12,
            lineHeight: 18,
            color: '#FFFFFF',
            textAlign: 'center',
            marginTop: 4,
          }}
          numberOfLines={2}
        >
          {description}
        </AppText>
      </View>
    </View>
  );
}
