/**
 * 분실물 목록 화면 - Figma 1228:1018
 */
import React from 'react';
import { BackdropScreenTemplate } from '../../../src/components/templates/BackdropScreenTemplate';
import { LostFoundList } from '../../../src/components/organisms/LostFoundList';
import { useLostFound } from '../../../src/hooks/useLostFound';

export default function LostFoundListScreen() {
  const { items, isLoading, error } = useLostFound();

  return (
    <BackdropScreenTemplate
      title="분실물"
      backdropVariant="lost-found"
      headerTextColor="#000000"
    >
      <LostFoundList items={items} isLoading={isLoading} error={error} />
    </BackdropScreenTemplate>
  );
}
