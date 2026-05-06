/**
 * ImageLightbox - 이미지 carousel 모달 (이벤트·굿즈샵 등 공용)
 *
 * 화면 전체 50% 어두운 backdrop, 가운데 큰 사진, 좌/우 chevron 으로 순환.
 * backdrop / X 탭 시 닫힘. subject 의 images 배열을 carousel.
 *
 * subject 는 FestivalEvent / GoodsItem / 그 외 어떤 도메인 타입이든 OK 인
 * 최소 shape (id, title, images?, imageUri?). null 이면 모달 닫힘.
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, Modal, Platform, Pressable, View } from 'react-native';
import { safeImageSource } from '@utils/imageSource';

export interface ImageLightboxSubject {
  id: string;
  title: string;
  /** 단일 외부 URL — images 가 비어 있을 때만 1장으로 사용. */
  imageUri?: string;
  /** 로컬 require'd asset 다중 — carousel slide 들. */
  images?: ImageSourcePropType[];
}

export interface ImageLightboxProps {
  subject: ImageLightboxSubject | null;
  onClose: () => void;
}

export function ImageLightbox({ subject, onClose }: ImageLightboxProps) {
  const localImages = subject?.images ?? [];
  const fallbackRemote = safeImageSource(subject?.imageUri);
  // safeImageSource 의 { uri: string } 도 ImageSourcePropType 의 union 멤버라 동일 타입.
  const sources: ImageSourcePropType[] = localImages.length
    ? localImages
    : fallbackRemote
      ? [fallbackRemote]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 다른 subject 로 전환 시 인덱스 0 으로 리셋
  useEffect(() => {
    setCurrentIndex(0);
  }, [subject?.id]);

  if (!subject || sources.length === 0) {
    return (
      <Modal visible={!!subject} transparent animationType="fade" onRequestClose={onClose}>
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
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
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
        {/* 가운데 이미지 — 부모 backdrop 의 onPress 가 같이 발화하지 않도록 자체 Pressable */}
        <Pressable
          onPress={() => { /* 이벤트 소비, 닫기 안 함 */ }}
          style={{ width: '90%', maxWidth: 720, aspectRatio: 0.75 }}
        >
          <Image
            source={sources[currentIndex]}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
            accessibilityLabel={`${subject.title} ${currentIndex + 1}/${sources.length}`}
          />
        </Pressable>

        {sources.length > 1 ? (
          <>
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
          </>
        ) : null}

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
