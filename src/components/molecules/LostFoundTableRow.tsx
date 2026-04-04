/**
 * LostFoundTableRow - 분실물 테이블 행
 *
 * Figma 82:77: Product/Information 2열 레이아웃
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';

export interface LostFoundTableRowProps {
  productTitle: string;
  productItems: string[];
  infoTitle: string;
  infoItems: string[];
}

export function LostFoundTableRow({
  productTitle,
  productItems,
  infoTitle,
  infoItems,
}: LostFoundTableRowProps) {
  return (
    <View className="flex-row py-4 px-2">
      <View className="flex-1 gap-[10px] p-[10px]">
        <AppText variant="body" className="font-bold">
          {productTitle}
        </AppText>
        {productItems.map((item, idx) => (
          <AppText key={idx} variant="caption">
            {item}
          </AppText>
        ))}
      </View>
      <View className="flex-1 gap-[10px] p-[10px]">
        <AppText variant="body" className="font-bold">
          {infoTitle}
        </AppText>
        {infoItems.map((item, idx) => (
          <AppText key={idx} variant="caption">
            {item}
          </AppText>
        ))}
      </View>
    </View>
  );
}
