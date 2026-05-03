/**
 * 굿즈샵 화면 - Figma 2047:725
 *
 * 네이비 배경 + 공용 ScreenBackdrop blob + 흰 헤더 위에 "Goods List" 알약 +
 * 캐러셀 카드. BackdropScreenTemplate 의 backdropVariant='booth' 가 동일한
 * UNIFIED_BLOBS 좌표를 쓰므로 별도 변형 불필요.
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { BackdropScreenTemplate } from '../../src/components/templates/BackdropScreenTemplate';
import { GoodsShopHero } from '../../src/components/organisms/GoodsShopHero';
import { useGoodsShop } from '../../src/hooks/useGoodsShop';

export default function GoodsShopScreen() {
  const { data: items } = useGoodsShop();

  return (
    <BackdropScreenTemplate
      title="굿즈샵"
      backdropVariant="booth"
      headerTextColor="#000000"
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <GoodsShopHero items={items} />
      </ScrollView>
    </BackdropScreenTemplate>
  );
}
