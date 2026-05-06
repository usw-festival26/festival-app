/**
 * EventLightbox - 이벤트 사진 라이트박스 모달
 *
 * 화면 전체에 50% 어두운 backdrop, 가운데 큰 사진, 좌/우 화살표로 순환.
 * backdrop 빈 영역 또는 우상단 X 탭 시 닫힘.
 *
 * props:
 *  - event: FestivalEvent | null — null 이면 모달 닫혀 있음
 *  - onClose: () => void
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Platform, Pressable, View } from 'react-native';
import { safeImageSource } from '@utils/imageSource';
import type { FestivalEvent } from '../../types/map';

export interface EventLightboxProps {
  event: FestivalEvent | null;
  onClose: () => void;
}

export function EventLightbox({ event, onClose }: EventLightboxProps) {
  const images = event?.images ?? [];
  // 단일 imageUri (외부 URL) 만 있는 케이스도 안전하게 carousel 처리.
  const fallbackRemote = safeImageSource(event?.imageUri);
  const sources: Array<{ uri: string } | number | object> = images.length
    ? (images as any[])
    : fallbackRemote
      ? [fallbackRemote]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 다른 이벤트로 전환 시 인덱스 0 으로 리셋
  useEffect(() => {
    setCurrentIndex(0);
  }, [event?.id]);

  if (!event || sources.length === 0) {
    return (
      <Modal visible={!!event} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable
          onPress={onClose}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
      </Modal>
    );
  }

  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + sources.length) % sources.length);
  const goNext = () =>
    setCurrentIndex((i) => (i + 1) % sources.length);

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 배경 — 탭하면 닫힘. backgroundImage(web) 가 있으면 cursor pointer. */}
      <Pressable
        onPress={onClose}
        accessibilityLabel="라이트박스 닫기"
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 가운데 이미지 — Pressable 내부지만 자체적으로 onPress 차단 */}
        <Pressable onPress={(e) => e.stopPropagation?.()} style={{ width: '90%', maxWidth: 720, aspectRatio: 0.75 }}>
          <Image
            source={sources[currentIndex] as any}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
            accessibilityLabel={`${event.title} ${currentIndex + 1}/${sources.length}`}
          />
        </Pressable>

        {/* 좌측 화살표 */}
        {sources.length > 1 ? (
          <Pressable
            onPress={goPrev}
            accessibilityRole="button"
            accessibilityLabel="이전 사진"
            hitSlop={12}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              marginTop: -24,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={48} color="#FFFFFF" />
          </Pressable>
        ) : null}

        {/* 우측 화살표 */}
        {sources.length > 1 ? (
          <Pressable
            onPress={goNext}
            accessibilityRole="button"
            accessibilityLabel="다음 사진"
            hitSlop={12}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              marginTop: -24,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-forward" size={48} color="#FFFFFF" />
          </Pressable>
        ) : null}

        {/* 우상단 닫기 X */}
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="닫기"
          hitSlop={12}
          style={{
            position: 'absolute',
            top: Platform.OS === 'web' ? 24 : 60,
            right: 16,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="close" size={32} color="#FFFFFF" />
        </Pressable>

        {/* 하단 dot pagination */}
        {sources.length > 1 ? (
          <View
            style={{
              position: 'absolute',
              bottom: 32,
              left: 0,
              right: 0,
              flexDirection: 'row',
              gap: 8,
              justifyContent: 'center',
            }}
          >
            {sources.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </View>
        ) : null}
      </Pressable>
    </Modal>
  );
}
