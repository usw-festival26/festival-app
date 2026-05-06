/**
 * ArtistCard - 라인업 아티스트 카드 (Figma 1014:489-491)
 *
 * 274×269 흰 blob 카드 — 4개 모서리 중 1개(tail)만 10px 각지고 나머지는 134.5px 둥근 형태.
 * 카드 아래 opposite 측면에 아티스트명/Information 텍스트를 배치.
 *
 * `artist.info` 가 `@handle` 형식이면 카드 탭 시 인스타그램으로 이동.
 */
import React from 'react';
import { Image, Linking, Platform, Pressable, View } from 'react-native';
import { AppText } from '@atoms/AppText';
import { safeImageSource } from '@utils/imageSource';
import type { Artist } from '../../types/lineup';

/**
 * `info` 가 `@xxx` 형태이면 인스타그램 URL 생성. 핸들에 영숫자/`._` 외 문자가 있으면
 * 잘못된 입력으로 보고 null. 빈 핸들도 null.
 */
function instagramUrlFromInfo(info: string | undefined): string | null {
  if (!info) return null;
  const trimmed = info.trim();
  if (!trimmed.startsWith('@')) return null;
  const handle = trimmed.slice(1);
  if (!handle || !/^[A-Za-z0-9._]+$/.test(handle)) return null;
  return `https://www.instagram.com/${handle}/`;
}

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

  // 로컬 require() asset 우선, 없으면 외부 imageUrl(보안 가드 통과 시) 폴백.
  const remoteSrc = safeImageSource(artist.imageUrl);
  const imageSource = artist.image ?? remoteSrc ?? null;

  const igUrl = instagramUrlFromInfo(artist.info);
  // canOpenURL 로 핸들러 가능 여부 먼저 확인 — IG 앱 미설치 / web view 차단 등
  // 예외 상황에서 RN 이 throw 하지 않고 조용히 noop.
  const handlePress = igUrl
    ? async () => {
        try {
          if (await Linking.canOpenURL(igUrl)) {
            await Linking.openURL(igUrl);
          }
        } catch {
          // 외부 앱 열기 실패는 무시 — 사용자 입장에선 단순히 반응 없음.
        }
      }
    : undefined;

  return (
    <View style={{ width: 274, alignItems: labelAlign }}>
      <Pressable
        onPress={handlePress}
        accessibilityRole={igUrl ? 'link' : undefined}
        accessibilityLabel={igUrl ? `${artist.name} 인스타그램으로 이동` : artist.name}
        disabled={!igUrl}
        style={({ pressed }) => [
          { width: 274, height: 269, backgroundColor: '#FFFFFF', overflow: 'hidden' },
          cardRadii,
          pressed && igUrl ? { opacity: 0.85 } : null,
        ]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : null}
      </Pressable>
      <View style={{ marginTop: 10, paddingHorizontal: 4 }}>
        <AppText
          style={{
            fontFamily: ROBOTO_BLACK,
            fontWeight: '900',
            fontSize: 20,
            lineHeight: 23,
            color: '#010070',
            textAlign,
          }}
        >
          {artist.name}
        </AppText>
        <AppText
          style={{
            fontFamily: 'Pretendard-Regular',
            fontSize: 12,
            color: '#010070',
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
