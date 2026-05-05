/**
 * CollegeGrid - 단과대 카드 2열 그리드 (부스/메뉴 진입점).
 *
 * /menu, /booth(바텀시트) 양쪽이 공유. 카드 1장 = 단과대 1개 (CLUSTERS_DATA 기준).
 * 카드 탭 → 부모가 그 단과대의 부스 그리드 화면으로 이동시킨다.
 *
 * 디자인 미정 — 일단 `MenuBoothCard` 재사용하고 organizer 슬롯에만 단과대명을
 * 채워 빈 이미지 영역 + 단과대명만 표시한다 (mainMenu/menuItems/imageUri 생략).
 *
 * 정렬: COLLEGE_ORDER (HUMANITIES → BUSINESS → LIFE → ICT → DESIGN → MUSIC →
 * ENGINEERING). collegeKey 가 없는 cluster 는 뒤로 밀린다.
 */
import React from 'react';
import { ScrollView, View } from 'react-native';
import { MenuBoothCard } from '@molecules/MenuBoothCard';
import { collegeSortIndex } from '@data/collegeLabels';
import type { BoothCluster } from '../../types/cluster';

export interface CollegeGridProps {
  clusters: BoothCluster[];
  onPressCollege: (cluster: BoothCluster) => void;
  /**
   * /booth 바텀시트 안에서 사용할 때는 자체 ScrollView 가 부모에 이미 있어
   * `embedded=true` 로 두면 ScrollView 없이 View 만 반환한다.
   */
  embedded?: boolean;
}

export function CollegeGrid({ clusters, onPressCollege, embedded }: CollegeGridProps) {
  const sorted = [...clusters].sort(
    (a, b) => collegeSortIndex(a.collegeKey) - collegeSortIndex(b.collegeKey),
  );

  // 2열 페어링
  const rows: BoothCluster[][] = [];
  for (let i = 0; i < sorted.length; i += 2) {
    rows.push(sorted.slice(i, i + 2));
  }

  const grid = (
    <>
      {rows.map((row, i) => (
        <View key={i} className="flex-row">
          {row.map((cluster) => (
            <MenuBoothCard
              key={cluster.id}
              organizer={cluster.name}
              onPress={() => onPressCollege(cluster)}
            />
          ))}
          {row.length === 1 && <View className="flex-1 mx-[13px]" />}
        </View>
      ))}
    </>
  );

  if (embedded) {
    return <View className="px-3">{grid}</View>;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 24, paddingBottom: 32 }}>
      {grid}
    </ScrollView>
  );
}
