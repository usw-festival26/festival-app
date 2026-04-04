/**
 * MenuItem - 부스 메뉴 아이템
 *
 * @example
 * <MenuItem name="떡볶이" price={4000} isAvailable={true} />
 */
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../atoms/AppText';
import { Badge } from '../atoms/Badge';

export interface MenuItemProps {
  name: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
  className?: string;
}

export function MenuItem({
  name,
  price,
  description,
  isAvailable = true,
  className = '',
}: MenuItemProps) {
  return (
    <View className={`flex-row items-center px-4 py-3 ${className}`}>
      <View className="flex-1">
        <AppText variant="body" className={!isAvailable ? 'text-gray-400' : ''}>
          {name}
        </AppText>
        {description && <AppText variant="caption">{description}</AppText>}
      </View>
      <View className="items-end">
        <AppText variant="body" className="font-semibold">
          ₩{price.toLocaleString()}
        </AppText>
        {!isAvailable && <Badge text="품절" variant="danger" className="mt-1" />}
      </View>
    </View>
  );
}
