/**
 * 지도 화면 - Figma 82:62 ~ 166:472, 1413:1008
 *
 * 상단: 메인 지도.png + 핀 / 하단: 드래그 바텀시트 (booth/food/facility/event 가로 페이징)
 *
 * 칩 ↔ 핀 필터 동기화
 *  - 시트 접힘(expanded=false)              → 핀 전부 표시
 *  - 시트 펼침 + booth 칩                    → 단과대 그룹 핀(cluster) 만 표시
 *  - 시트 펼침 + food 칩                     → 푸드 핀만
 *  - 시트 펼침 + facility 칩                 → 편의 핀만
 *  - 시트 펼침 + event 칩                    → 핀 전부 (event 는 지도 핀 없음)
 *
 * 클러스터 핀 클릭 → 시트 booth 페이지로 슬라이드 + selectedClusterId 로 멤버 부스만 필터.
 * 푸드 핀 클릭 → boothId 있으면 /booth/[id] 로 push.
 * 편의 핀 클릭 → 시트 facility 페이지로 슬라이드.
 */
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { BoothMapView } from '../../../src/components/organisms/BoothMapView';
import { MapCategoryChips } from '../../../src/components/molecules/MapCategoryChips';
import type { AnyPin } from '../../../src/components/organisms/MapCanvas';
import { useBooths } from '../../../src/hooks/useBooths';
import { useClusters } from '../../../src/hooks/useClusters';
import { EVENTS_DATA } from '../../../src/data/events';
import { FOOD_PINS_DATA } from '../../../src/data/foodPins';
import { FACILITY_PINS_DATA } from '../../../src/data/facilityPins';
import { isClusterMember } from '../../../src/utils/clusterMembership';
import type { PinCategory } from '../../../src/types/cluster';
import type { MapCoords, SheetCategory } from '../../../src/types/map';

export default function BoothMapScreen() {
  const router = useRouter();
  const { booths: allBooths, isLoading, error, retry } = useBooths();
  const { clusters } = useClusters();
  const foodBooths = allBooths.filter((b) => b.category === 'food');
  const nonFoodBooths = allBooths.filter((b) => b.category !== 'food');

  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SheetCategory>('booth');
  const [selectedClusterId, setSelectedClusterId] = useState<string | undefined>();
  // F&B / 편의 카드 클릭 시 임의 좌표 줌인 트리거. nonce 갱신으로 같은 핀
  // 반복 클릭도 매번 동작.
  const [focusRequest, setFocusRequest] = useState<{ coords: MapCoords; nonce: number } | null>(null);
  const handleCardFocus = useCallback((coords: MapCoords) => {
    setFocusRequest({ coords, nonce: Date.now() });
  }, []);

  // 시트 접거나 카테고리 바뀌면 selectedClusterId 리셋
  const handleExpandedChange = (next: boolean) => {
    setExpanded(next);
    if (!next) setSelectedClusterId(undefined);
  };
  const handleCategoryChange = (cat: SheetCategory) => {
    setActiveCategory(cat);
    if (cat !== 'booth') setSelectedClusterId(undefined);
  };

  // 핀 카테고리 필터 derivation
  const pinFilter: 'all' | PinCategory = !expanded
    ? 'all'
    : activeCategory === 'booth'
      ? 'cluster'
      : activeCategory === 'food'
        ? 'food'
        : activeCategory === 'facility'
          ? 'facility'
          : 'all';

  // 자동 줌인 — F&B / 편의 칩 활성 시 해당 핀들의 bbox 중심으로 카메라 이동.
  // 사용자 명시 X 인 booth(cluster) 칩은 줌 안 함 (단과대 핀이 흩어져 있어 의미 적음).
  const focusCategory: PinCategory | null =
    expanded && (activeCategory === 'food' || activeCategory === 'facility')
      ? activeCategory
      : null;

  const handlePinPress = (pin: AnyPin) => {
    if (pin.category === 'cluster') {
      setSelectedClusterId(pin.id);
      setActiveCategory('booth');
      setExpanded(true);
      return;
    }
    if (pin.category === 'food') {
      if (pin.boothId) {
        router.push(`/(tabs)/booth/${pin.boothId}` as never);
      } else {
        setActiveCategory('food');
        setExpanded(true);
      }
      return;
    }
    if (pin.category === 'facility') {
      setActiveCategory('facility');
      setExpanded(true);
    }
  };

  // 클러스터 필터 — selectedClusterId 가 있으면 isClusterMember 헬퍼로 좁힘.
  // 매칭 우선순위(OR): collegeKey enum → cluster.name 라벨 → boothIds 수동.
  // 백엔드가 college enum 만 채우면 자동 self-healing.
  const visibleBooths = (() => {
    if (!selectedClusterId) return nonFoodBooths;
    const cluster = clusters.find((c) => c.id === selectedClusterId);
    if (!cluster) return nonFoodBooths;
    return nonFoodBooths.filter((b) => isClusterMember(cluster, b));
  })();

  const selectedClusterName = selectedClusterId
    ? clusters.find((c) => c.id === selectedClusterId)?.name
    : undefined;

  return (
    <BackdropScreenTemplate
      title="지도"
      backdropVariant="booth"
      headerSubHeader={
        <MapCategoryChips
          expanded={expanded}
          activeCategory={activeCategory}
          onExpandedChange={handleExpandedChange}
          onCategoryChange={handleCategoryChange}
        />
      }
    >
      <BoothMapView
        expanded={expanded}
        activeCategory={activeCategory}
        booths={visibleBooths}
        foodBooths={foodBooths}
        events={EVENTS_DATA}
        clusters={clusters}
        foodPins={FOOD_PINS_DATA}
        facilityPins={FACILITY_PINS_DATA}
        pinFilter={pinFilter}
        focusCategory={focusCategory}
        focusRequest={focusRequest}
        onCardFocus={handleCardFocus}
        onPinPress={handlePinPress}
        selectedClusterName={selectedClusterName}
        onClearClusterFilter={() => setSelectedClusterId(undefined)}
        onSelectCluster={(id) => {
          // 단과대 카드 탭 = cluster pin 탭과 동일한 효과 (시트 펼침은 이미 켜져 있음)
          setSelectedClusterId(id);
          setActiveCategory('booth');
        }}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        onExpandedChange={handleExpandedChange}
        onCategoryChange={handleCategoryChange}
      />
    </BackdropScreenTemplate>
  );
}
