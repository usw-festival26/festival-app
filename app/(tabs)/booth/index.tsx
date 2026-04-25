/**
 * 지도 화면 - Figma 82:62 ~ 166:472
 *
 * 상단: Main Map placeholder / 하단: 드래그 바텀시트 (booth/food/facility/event 가로 페이징)
 */
import React, { useState } from 'react';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { BoothMapView } from '../../../src/components/organisms/BoothMapView';
import { MapCategoryChips } from '../../../src/components/molecules/MapCategoryChips';
import { useBooths } from '../../../src/hooks/useBooths';
import { FACILITIES_DATA } from '../../../src/data/facilities';
import { EVENTS_DATA } from '../../../src/data/events';
import type { SheetCategory } from '../../../src/types/map';

export default function BoothMapScreen() {
  const { booths: allBooths, isLoading, error } = useBooths();
  const foodBooths = allBooths.filter((b) => b.category === 'food');
  const nonFoodBooths = allBooths.filter((b) => b.category !== 'food');

  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SheetCategory>('booth');

  return (
    <BackdropScreenTemplate
      title="지도"
      backdropVariant="booth"
      headerSubHeader={
        <MapCategoryChips
          expanded={expanded}
          activeCategory={activeCategory}
          onExpandedChange={setExpanded}
          onCategoryChange={setActiveCategory}
        />
      }
    >
      <BoothMapView
        expanded={expanded}
        activeCategory={activeCategory}
        booths={nonFoodBooths}
        foodBooths={foodBooths}
        facilities={FACILITIES_DATA}
        events={EVENTS_DATA}
        isLoading={isLoading}
        error={error}
        onExpandedChange={setExpanded}
        onCategoryChange={setActiveCategory}
      />
    </BackdropScreenTemplate>
  );
}
