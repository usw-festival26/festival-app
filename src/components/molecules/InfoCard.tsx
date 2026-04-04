/**
 * InfoCard - 범용 정보 카드 위젯
 *
 * 부스, 공지, 분실물 등 다양한 목록에서 재사용할 수 있는 카드입니다.
 *
 * @example
 * <InfoCard
 *   title="떡볶이 천국"
 *   subtitle="컴퓨터공학과"
 *   description="매콤한 떡볶이와 튀김을 판매합니다."
 *   badgeText="Food"
 *   badgeVariant="success"
 *   onPress={() => router.push(`/booth/${id}`)}
 * />
 */
import React from 'react';
import { Image, type ImageSourcePropType, Pressable, View } from 'react-native';
import { AppText } from '../atoms/AppText';
import { Badge, type BadgeVariant } from '../atoms/Badge';

export interface InfoCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
  className?: string;
}

export function InfoCard({
  title,
  subtitle,
  description,
  badgeText,
  badgeVariant,
  imageSource,
  onPress,
  className = '',
}: InfoCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`overflow-hidden rounded-xl bg-festival-card shadow-sm ${className}`}
    >
      {imageSource && (
        <Image source={imageSource} className="h-40 w-full" resizeMode="cover" />
      )}
      <View className="p-4">
        {badgeText && (
          <Badge text={badgeText} variant={badgeVariant} className="mb-2" />
        )}
        <AppText variant="h3">{title}</AppText>
        {subtitle && (
          <AppText variant="caption" className="mt-1">
            {subtitle}
          </AppText>
        )}
        {description && (
          <AppText variant="body" className="mt-2" numberOfLines={2}>
            {description}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}
