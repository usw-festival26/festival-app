/**
 * 부스 상세 화면 - Figma 135:134
 *
 * 학과명 + 이미지 + 메뉴 테이블 + 부스 공지
 */
import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../../src/components/molecules/ScreenHeader';
import { BoothDetail } from '../../../src/components/organisms/BoothDetail';
import { EmptyState } from '../../../src/components/molecules/EmptyState';
import { useBoothById } from '../../../src/hooks/useBooths';
import { AppButton } from '../../../src/components/atoms/AppButton';

export default function BoothDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { booth } = useBoothById(id ?? '');

  if (!booth) {
    return (
      <SafeAreaView className="flex-1 bg-festival-bg" edges={['top']}>
        <ScreenHeader title="메뉴" />
        <EmptyState message="부스를 찾을 수 없습니다." />
        <View className="items-center">
          <AppButton onPress={() => router.back()}>돌아가기</AppButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-festival-bg" edges={['top']}>
      <ScreenHeader title="메뉴" />
      <BoothDetail booth={booth} />
    </SafeAreaView>
  );
}
