/**
 * 분실물 목록 화면 - Figma 82:77
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { ListScreenTemplate } from '../../../src/components/templates/ListScreenTemplate';
import { LostFoundList } from '../../../src/components/organisms/LostFoundList';
import { useLostFound } from '../../../src/hooks/useLostFound';

export default function LostFoundListScreen() {
  const router = useRouter();
  const { items } = useLostFound();

  return (
    <ListScreenTemplate title="분실물">
      <LostFoundList
        items={items}
        onPressItem={(item) => router.push(`/(tabs)/lost-found/${item.id}`)}
      />
    </ListScreenTemplate>
  );
}
