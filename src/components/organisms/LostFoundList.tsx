/**
 * LostFoundList - 분실물 테이블 리스트
 *
 * Figma 82:77: 단일 흰색 카드 안에 2열(물품/정보) 테이블 레이아웃 + 하단 문의번호
 */
import React from 'react';
import { ScrollView, View } from 'react-native';
import type { LostFoundItem } from '../../types/lostFound';
import { AppText } from '../atoms/AppText';
import { LostFoundTableRow } from '../molecules/LostFoundTableRow';
import { EmptyState } from '../molecules/EmptyState';
import { formatDate } from '../../utils/date';

const STATUS_LABEL: Record<string, string> = {
  lost: '분실',
  found: '발견',
  claimed: '수령완료',
};

const CATEGORY_LABEL: Record<string, string> = {
  electronics: '전자기기',
  clothing: '의류',
  accessories: '액세서리',
  bags: '가방',
  other: '기타',
};

const CONTACT_NUMBERS = ['010-1234-5678', '010-1234-5678'];

export interface LostFoundListProps {
  items: LostFoundItem[];
  onPressItem?: (item: LostFoundItem) => void;
}

export function LostFoundList({ items, onPressItem }: LostFoundListProps) {
  if (items.length === 0) {
    return <EmptyState message="등록된 분실물이 없습니다." iconName="search-outline" />;
  }

  return (
    <ScrollView contentContainerClassName="px-4 py-4 gap-4">
      {/* 메인 카드: 2열 테이블 */}
      <View className="bg-festival-card rounded-card-lg px-2 py-4">
        {items.map((item) => (
          <LostFoundTableRow
            key={item.id}
            productTitle={item.title}
            productItems={[
              CATEGORY_LABEL[item.category] ?? item.category,
              item.description,
              STATUS_LABEL[item.status] ?? item.status,
            ]}
            infoTitle={item.location}
            infoItems={[
              formatDate(item.reportedAt),
              STATUS_LABEL[item.status] ?? item.status,
              CATEGORY_LABEL[item.category] ?? item.category,
            ]}
          />
        ))}
      </View>

      {/* 하단 문의번호 */}
      <View className="bg-festival-card rounded-card-lg px-4 py-3 items-center gap-1">
        {CONTACT_NUMBERS.map((number, idx) => (
          <View key={idx} className="flex-row items-center gap-3">
            <AppText variant="caption" className="text-festival-text">
              문의번호
            </AppText>
            <View className="w-[3px] h-[3px] rounded-full bg-festival-text" />
            <AppText variant="caption" className="text-festival-text">
              {number}
            </AppText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
