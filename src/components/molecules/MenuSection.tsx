/**
 * MenuSection - 부스 상세의 Main/Side/Set 섹션 하나
 *
 * Figma 1272:1632 / 964:663: Roboto Black 20 #010070 제목 + 이름(왼쪽) · 가격(오른쪽 네이비) 목록.
 * 라벨 정렬은 `align` 으로 제어 ('left' 기본, 'center' 는 Figma 964:663 스타일).
 *
 * 품절 (item.isAvailable === false) — 이름 strike-through + 회색, 가격 자리는
 * 빨간 "품절" 라벨로 교체. 메뉴는 노출하되 주문 불가임을 한눈에 인지.
 */
import React from 'react';
import { View, Platform } from 'react-native';
import { AppText } from '@atoms/AppText';
import { Colors } from '@constants/colors';
import type { BoothMenuItem } from '../../types/booth';

export interface MenuSectionProps {
  label: string;
  items: BoothMenuItem[];
  align?: 'left' | 'center';
}

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

export function MenuSection({ label, items, align = 'left' }: MenuSectionProps) {
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
          textAlign: align,
        }}
      >
        {label}
      </AppText>
      <View style={{ gap: 10 }}>
        {items.map((item) => {
          const soldOut = item.isAvailable === false;
          return (
            <View
              key={item.id}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <AppText
                style={{
                  fontFamily: 'Pretendard-SemiBold',
                  fontSize: 15,
                  color: soldOut ? Colors.festival.muted : '#000000',
                  textDecorationLine: soldOut ? 'line-through' : 'none',
                }}
              >
                {item.name}
              </AppText>
              {soldOut ? (
                <AppText
                  style={{
                    fontFamily: 'Pretendard-SemiBold',
                    fontSize: 15,
                    color: Colors.festival.errorRed,
                    textAlign: 'right',
                  }}
                  accessibilityLabel="품절"
                >
                  품절
                </AppText>
              ) : (
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
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
