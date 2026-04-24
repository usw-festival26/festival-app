/**
 * 메뉴 상세 화면 - Figma 135:134
 *
 * 뒤로가기 + 학부명 + 이미지 + 3열 메뉴 테이블 + 부스 설명
 */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { BoothDetail } from '../../../src/components/organisms/BoothDetail';
import { EmptyState } from '../../../src/components/molecules/EmptyState';
import { useBoothById } from '../../../src/hooks/useBooths';
import { AppButton } from '../../../src/components/atoms/AppButton';

export default function MenuDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { booth, isLoading, error } = useBoothById(id ?? '');

  if (isLoading) {
    return (
      <BackdropScreenTemplate title="메뉴" backdropVariant="menu" leftAction="back">
        <View className="items-center py-16">
          <ActivityIndicator size="small" color="#02015B" />
        </View>
      </BackdropScreenTemplate>
    );
  }

  if (error) {
    return (
      <BackdropScreenTemplate title="메뉴" backdropVariant="menu" leftAction="back">
        <EmptyState
          message={`메뉴를 불러오지 못했습니다.\n${error}`}
          iconName="alert-circle-outline"
        />
        <View className="items-center">
          <AppButton onPress={() => router.back()}>돌아가기</AppButton>
        </View>
      </BackdropScreenTemplate>
    );
  }

  if (!booth) {
    return (
      <BackdropScreenTemplate title="메뉴" backdropVariant="menu" leftAction="back">
        <EmptyState message="부스를 찾을 수 없습니다." />
        <View className="items-center">
          <AppButton onPress={() => router.back()}>돌아가기</AppButton>
        </View>
      </BackdropScreenTemplate>
    );
  }

  return (
    <BackdropScreenTemplate title="메뉴" backdropVariant="menu" leftAction="back">
      <BoothDetail booth={booth} />
    </BackdropScreenTemplate>
  );
}
