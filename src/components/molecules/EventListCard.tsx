/**
 * EventListCard - 이벤트 페이지 세로형 카드 (Figma 1590:1116)
 *
 * 274×269 pure white rounded-10 카드. 카드 아래(네이비 배경) 에 흰색 title/description.
 * Figma: 카드 내부엔 이미지/placeholder 만, 텍스트는 카드 외부.
 */
import { AppText } from '@atoms/AppText';
import { safeImageSource } from '@utils/imageSource';
import React from 'react';
import { Image, ImageSourcePropType, Platform, Pressable, View } from 'react-native';

export interface EventListCardProps {
  title: string;
  description: string;
  /** 외부 이미지 URL (백엔드 모드용). */
  imageUri?: string;
  /** 로컬 require'd asset (fixture 모드용 — imageUri 보다 우선). */
  image?: ImageSourcePropType;
  /** 카드(이미지 영역) 탭 핸들러 — 보통 라이트박스 모달 열기 용. */
  onPress?: () => void;
}

const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

export function EventListCard({ title, description, imageUri, image, onPress }: EventListCardProps) {
  const remoteSrc = safeImageSource(imageUri);
  const imageSource = image ?? remoteSrc ?? null;
  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={onPress ? `${title} 사진 보기` : undefined}
        style={({ pressed }) => ({
          width: 274,
          height: 269,
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          opacity: pressed && onPress ? 0.85 : 1,
        })}
      >
        {imageSource ? (
          <Image source={imageSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : null}
      </Pressable>

      <View style={{ width: 274, marginTop: 12, alignItems: 'center' }}>
        <AppText
          style={{
            fontFamily: PRETENDARD_SEMIBOLD,
            fontWeight: '600',
            fontSize: 15,
            lineHeight: 20,
            color: '#010070',
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
            color: '#010070',
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
