/**
 * MenuSection - 부스 상세의 Main/Side/Set 섹션 하나
 *
 * Figma 1272:1632: Roboto Black 20 #010070 제목 + 이름(왼쪽) · 가격(오른쪽 네이비) 목록
 */
import React from 'react';
import { View, Platform } from 'react-native';
import { AppText } from '@atoms/AppText';
import type { BoothMenuItem } from '../../types/booth';

export interface MenuSectionProps {
  label: string;
  items: BoothMenuItem[];
}

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

export function MenuSection({ label, items }: MenuSectionProps) {
  if (items.length === 0) return null;
  return (
    <View>
      <AppText
        style={{
          fontFamily: ROBOTO_BLACK,
          fontWeight: '900',
          fontSize: 20,
          lineHeight: 23,
          color: '#010070',
          marginBottom: 14,
        }}
      >
        {label}
      </AppText>
      <View style={{ gap: 10 }}>
        {items.map((item) => (
          <View
            key={item.id}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <AppText
              style={{
                fontFamily: 'Pretendard-SemiBold',
                fontSize: 15,
                color: '#000000',
              }}
            >
              {item.name}
            </AppText>
            <AppText
              style={{
                fontFamily: 'Pretendard-SemiBold',
                fontSize: 15,
                color: '#010070',
                textAlign: 'right',
              }}
            >
              {item.price.toLocaleString()}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
