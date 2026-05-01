/**
 * 지도 화면 - Figma 82:62 ~ 166:472, 1413:1008
 *
 * 상단: festivalmap.jpg + 핀 / 하단: 드래그 바텀시트 (booth/food/facility/event 가로 페이징)
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
import React, { useState } from 'react';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { BoothMapView } from '../../../src/components/organisms/BoothMapView';
import { MapCategoryChips } from '../../../src/components/molecules/MapCategoryChips';
import type { AnyPin } from '../../../src/components/organisms/MapCanvas';
import { useBooths } from '../../../src/hooks/useBooths';
import { useClusters } from '../../../src/hooks/useClusters';
import { EVENTS_DATA } from '../../../src/data/events';
import { FOOD_PINS_DATA } from '../../../src/data/foodPins';
import { FACILITY_PINS_DATA } from '../../../src/data/facilityPins';
import type { PinCategory } from '../../../src/types/cluster';
import type { Facility, SheetCategory } from '../../../src/types/map';

/**
 * 시트 표시용 Facility[] 는 FACILITY_PINS_DATA 에서 추출.
 * 핀 = facility entity 라 별도 데이터 파일 불필요.
 */
const FACILITIES_FROM_PINS: Facility[] = FACILITY_PINS_DATA.map((p) => ({
  id: p.id,
  name: p.name,
  phone: p.phone,
}));

export default function BoothMapScreen() {
  const router = useRouter();
  const { booths: allBooths, isLoading, error, retry } = useBooths();
  const { clusters } = useClusters();
  const foodBooths = allBooths.filter((b) => b.category === 'food');
  const nonFoodBooths = allBooths.filter((b) => b.category !== 'food');

  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SheetCategory>('booth');
  const [selectedClusterId, setSelectedClusterId] = useState<string | undefined>();

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

  // 클러스터 필터 적용 — selectedClusterId 가 있으면 멤버 부스만
  const visibleBooths = (() => {
    if (!selectedClusterId) return nonFoodBooths;
    const cluster = clusters.find((c) => c.id === selectedClusterId);
    if (!cluster) return nonFoodBooths;
    const memberSet = new Set(cluster.boothIds);
    return nonFoodBooths.filter((b) => memberSet.has(b.id));
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
        facilities={FACILITIES_FROM_PINS}
        events={EVENTS_DATA}
        clusters={clusters}
        foodPins={FOOD_PINS_DATA}
        facilityPins={FACILITY_PINS_DATA}
        pinFilter={pinFilter}
        onPinPress={handlePinPress}
        selectedClusterName={selectedClusterName}
        onClearClusterFilter={() => setSelectedClusterId(undefined)}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        onExpandedChange={handleExpandedChange}
        onCategoryChange={handleCategoryChange}
      />
    </BackdropScreenTemplate>
  );
}
