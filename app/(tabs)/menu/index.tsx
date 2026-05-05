/**
 * 메뉴 진입 — 단과대 카드 그리드 (Figma 미정).
 *
 * 카드 1장 = 단과대 1개 (CLUSTERS_DATA 기준 7개), 탭 시 `/menu/college/<KEY>` 로
 * 이동해 그 단과대의 부스 그리드 노출.
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { CollegeGrid } from '../../../src/components/organisms/CollegeGrid';
import { useClusters } from '../../../src/hooks/useClusters';

export default function MenuListScreen() {
  const { clusters } = useClusters();
  const router = useRouter();

  return (
    <BackdropScreenTemplate title="메뉴" backdropVariant="menu">
      <CollegeGrid
        clusters={clusters}
        onPressCollege={(c) => {
          if (!c.collegeKey) return; // 동아리/특수 그룹 — 단과대 라우트 없음
          router.push(`/(tabs)/menu/college/${c.collegeKey}` as never);
        }}
      />
    </BackdropScreenTemplate>
  );
}
