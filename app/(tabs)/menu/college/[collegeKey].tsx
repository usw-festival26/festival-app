/**
 * 단과대별 부스 그리드 화면 - /menu/college/<KEY>
 *
 * /menu 진입 시 보이는 7개 단과대 카드 중 하나를 누르면 이 화면으로 진입.
 * 헤더 = 그 단과대명, 본문 = 해당 단과대 부스만 거른 MenuGrid.
 */
import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackdropScreenTemplate } from '../../../../src/components/templates/BackdropScreenTemplate';
import { MenuGrid } from '../../../../src/components/organisms/MenuGrid';
import { EmptyState } from '../../../../src/components/molecules/EmptyState';
import { AppButton } from '../../../../src/components/atoms/AppButton';
import { useBooths } from '../../../../src/hooks/useBooths';
import {
  COLLEGE_LABEL_FALLBACK,
  COLLEGE_LABEL_OVERRIDES,
  COLLEGE_ORDER,
} from '../../../../src/data/collegeLabels';
import type { BackendCollege } from '../../../../src/api/types';

function isBackendCollege(value: unknown): value is BackendCollege {
  return typeof value === 'string' && (COLLEGE_ORDER as readonly string[]).includes(value);
}

export default function CollegeBoothListScreen() {
  const { collegeKey: rawKey } = useLocalSearchParams<{ collegeKey: string }>();
  const router = useRouter();

  // enum 검증 — 잘못된 collegeKey 면 useBooths 를 호출해도 매칭 0 이라 큰 위험은 없지만
  // 헤더 라벨이 'undefined' 로 보이는 등 UX 가 깨지므로 명시적으로 EmptyState 분기.
  if (!isBackendCollege(rawKey)) {
    return (
      <BackdropScreenTemplate title="단과대" backdropVariant="menu" leftAction="back">
        <EmptyState message="단과대를 찾을 수 없습니다." />
        <View className="items-center">
          <AppButton onPress={() => router.back()}>돌아가기</AppButton>
        </View>
      </BackdropScreenTemplate>
    );
  }

  const collegeLabel =
    COLLEGE_LABEL_OVERRIDES[rawKey] ?? COLLEGE_LABEL_FALLBACK[rawKey];
  // useBooths 의 college 필터는 라벨 정확 일치 — collegeKey enum 이 동일해도 백엔드가
  // OVERRIDES 와 다른 라벨을 보내면 매칭 실패 가능. 운영 시 OVERRIDES 와 백엔드 라벨이
  // 일치하는지 확인 필요.
  const { booths, isLoading, error, retry } = useBooths({ college: collegeLabel });

  return (
    <BackdropScreenTemplate
      title={collegeLabel}
      backdropVariant="menu"
      leftAction="back"
    >
      <MenuGrid booths={booths} isLoading={isLoading} error={error} onRetry={retry} />
    </BackdropScreenTemplate>
  );
}
