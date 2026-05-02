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
import { NetworkErrorState } from '../../../src/components/atoms/NetworkErrorState';
import { useBoothById, useBoothMenus } from '../../../src/hooks/useBooths';
import { AppButton } from '../../../src/components/atoms/AppButton';
import { Colors } from '../../../src/constants/colors';

export default function BoothDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { booth, isLoading, error, retry } = useBoothById(id ?? '');
  // 메뉴는 별도 엔드포인트(`/api/booths/{id}/menu`) → fetchBooth 응답에 포함되지 않음.
  // 로딩 중에는 undefined 를 넘겨 BoothDetail 의 `menus ?? booth.menuItems ?? []`
  // 폴백 체인이 작동하도록 한다 (로컬 fixture 모드에선 즉시 메뉴 표시).
  const { menus, isLoading: menusLoading } = useBoothMenus(id ?? '');

  if (isLoading) {
    return (
      <BackdropScreenTemplate title="메뉴" backdropVariant="booth-detail">
        <View className="items-center py-16">
          <ActivityIndicator size="small" color={Colors.festival.primaryDark} />
        </View>
      </BackdropScreenTemplate>
    );
  }

  if (error) {
    return (
      <BackdropScreenTemplate title="메뉴" backdropVariant="booth-detail">
        <NetworkErrorState onRetry={retry} />
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
      <BoothDetail booth={booth} menus={menusLoading ? undefined : menus} />
    </BackdropScreenTemplate>
  );
}
