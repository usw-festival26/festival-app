/**
 * MenuSection - 부스 상세의 메뉴 섹션 한 묶음 (Figma 2205:683)
 *
 * 라벨(예: 'Menu' / 'Sold out') + 이름·가격 행 리스트.
 * 이름 좌측, 가격 우측 정렬, 둘 다 #001E56. 라벨 색은 prop 으로 분기
 * (Menu = navy, Sold out = #560001 등).
 *
 * sold-out 강조(취소선/'품절' 라벨) 는 이전 버전이 가졌던 책임이지만, 새 시안에서
 * 가용/품절을 별도 섹션으로 묶기 때문에 여기선 단순 flat list 만 그린다.
 */
import React from 'react';
import { View, Platform } from 'react-native';
import { AppText } from '@atoms/AppText';
import type { BoothMenuItem } from '../../types/booth';

export interface MenuSectionProps {
  label: string;
  items: BoothMenuItem[];
  /** 라벨 색 — Menu(default navy) vs Sold out(#560001) 분기 용. */
  labelColor?: string;
  /** 라벨 정렬 ('center' 기본 — Figma 시안). */
  align?: 'left' | 'center';
}

const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

export function MenuSection({
  label,
  items,
  labelColor = '#001E56',
  align = 'center',
}: MenuSectionProps) {
  if (items.length === 0) return null;
  return (
    <View>
      <AppText
        style={{
          fontFamily: ROBOTO_BLACK,
          fontWeight: '900',
          fontSize: 20,
          lineHeight: 23,
          color: labelColor,
          marginBottom: 14,
          textAlign: align,
        }}
      >
        {label}
      </AppText>
      <View style={{ gap: 11 }}>
        {items.map((item) => (
          <View
            key={item.id}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <AppText
              style={{
                fontFamily: 'Pretendard-SemiBold',
                fontSize: 15,
                color: '#001E56',
              }}
            >
              {item.name}
            </AppText>
            <AppText
              style={{
                fontFamily: 'Pretendard-SemiBold',
                fontSize: 15,
                color: '#001E56',
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
