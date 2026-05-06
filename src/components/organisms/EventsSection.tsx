/**
 * EventsSection - 홈 Events 가로 스크롤 (Figma 2139:753)
 *
 * 카드 1장 = 이벤트 1개. 첫 사진을 cover 배경 + 하단 어두운 페이드 + 흰글씨
 * 타이틀. 카드 탭 시 EventLightbox 모달 열림 (사진 4장 carousel + 50% backdrop).
 */
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEvents, useHorizontalDrag } from '@hooks/index';
import { ImageLightbox } from '@molecules/ImageLightbox';
import { safeImageSource } from '@utils/imageSource';
import type { FestivalEvent } from '../../types/map';

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });
const PRETENDARD_MEDIUM = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Medium' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

const CARD_W = 140;
const CARD_H = 180;
const NAME_BOTTOM_FADE_HEIGHT = 64;

/**
 * 사진 위 흰글씨 가독성용 하단 페이드. LineupSection 과 같은 패턴.
 */
const FADE_OVERLAY_STYLE = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: NAME_BOTTOM_FADE_HEIGHT,
  ...(Platform.OS === 'web'
    ? { backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)' }
    : { backgroundColor: 'rgba(0,0,0,0.35)' }),
} as any;

export function EventsSection() {
  const router = useRouter();
  const dragRef = useHorizontalDrag();
  const { data } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<FestivalEvent | null>(null);

  return (
    <View style={{ paddingTop: 41, paddingBottom: 27 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20,
          paddingRight: 17,
          marginBottom: 14,
        }}
      >
        <Text
          style={{
            fontFamily: ROBOTO_BLACK,
            fontWeight: '900',
            fontSize: 20,
            lineHeight: 23,
            color: '#010070',
            letterSpacing: 0,
          }}
        >
          Events
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/events' as any)}
          hitSlop={8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
          accessibilityRole="link"
          accessibilityLabel="이벤트 더보기"
        >
          <Text
            style={{
              fontFamily: PRETENDARD_REGULAR,
              fontWeight: '400',
              fontSize: 12,
              color: '#010070',
              opacity: 0.9,
            }}
          >
            더보기
          </Text>
          <Ionicons name="chevron-forward" size={12} color="#010070" style={{ opacity: 0.9 }} />
        </Pressable>
      </View>

      <ScrollView
        ref={dragRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 17, paddingRight: 48, gap: 10 }}
      >
        {data.slice(0, 6).map((item) => {
          const localFirst = item.images?.[0] ?? null;
          const remoteSrc = safeImageSource(item.imageUri);
          const thumbnailSource = localFirst ?? remoteSrc ?? null;
          const hasImage = !!thumbnailSource;
          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedEvent(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title} 사진 보기`}
              style={({ pressed }) => ({
                width: CARD_W,
                height: CARD_H,
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                overflow: 'hidden',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              {hasImage ? (
                <Image
                  source={thumbnailSource as any}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : null}

              {/* 하단 페이드 — 텍스트 가독성 */}
              {hasImage ? <View style={FADE_OVERLAY_STYLE} /> : null}

              <View style={{ position: 'absolute', left: 14, top: 133, right: 14 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: PRETENDARD_MEDIUM,
                    fontWeight: '500',
                    fontSize: 13,
                    lineHeight: 18,
                    letterSpacing: -0.5,
                    color: hasImage ? '#FFFFFF' : '#010070',
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: PRETENDARD_MEDIUM,
                    fontWeight: '500',
                    fontSize: 11,
                    lineHeight: 16,
                    letterSpacing: -0.5,
                    color: hasImage ? 'rgba(255,255,255,0.85)' : '#666',
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <ImageLightbox subject={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </View>
  );
}
