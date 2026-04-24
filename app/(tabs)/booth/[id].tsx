/**
 * 부스 상세 화면 - Figma 1272:1632
 *
 * BackdropScreenTemplate 헤더(햄버거) + BoothDetail(카드 안에 자체 뒤로가기 존재)
 */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { BoothDetail } from '../../../src/components/organisms/BoothDetail';
import { EmptyState } from '../../../src/components/molecules/EmptyState';
import { useBoothById } from '../../../src/hooks/useBooths';
import { AppButton } from '../../../src/components/atoms/AppButton';

export default function BoothDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { booth, isLoading, error } = useBoothById(id ?? '');

  if (isLoading) {
    return (
      <BackdropScreenTemplate title="메뉴" backdropVariant="booth-detail">
        <View className="items-center py-16">
          <ActivityIndicator size="small" color="#02015B" />
        </View>
      </BackdropScreenTemplate>
    );
  }

  if (error) {
    return (
      <BackdropScreenTemplate title="메뉴" backdropVariant="booth-detail">
        <EmptyState
          message={`부스를 불러오지 못했습니다.\n${error}`}
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
      <BackdropScreenTemplate title="메뉴" backdropVariant="booth-detail">
        <EmptyState message="부스를 찾을 수 없습니다." />
        <View className="items-center">
          <AppButton onPress={() => router.back()}>돌아가기</AppButton>
        </View>
      </BackdropScreenTemplate>
    );
  }

  return (
    <BackdropScreenTemplate title="메뉴" backdropVariant="booth-detail">
      <BoothDetail booth={booth} />
    </BackdropScreenTemplate>
  );
}
