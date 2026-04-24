/**
 * LostFoundCard - 분실물 카드 (Figma 1422:2435)
 *
 * rgba(224,220,255,0.5) 라벤더 반투명 + 흰 1px 보더 + rounded-20.
 * 상단: 썸네일(60×60 rounded-10 #FAFAFF) | 제목(navy SemiBold 15) + 위치(#3F3F5C Regular 12)
 * 중간: 가로 구분선 (#D9D9D9 0.5)
 * 하단 meta row: 시계 아이콘 + 날짜시간 + 수령처 | 상태
 *   - lost  → "찾는 중"  (no bg, black text)
 *   - found → "수령 가능" (white rounded-11 pill, black text)
 *   - claimed → "수령 완료" (lavender pill)
 */
import React from 'react';
import { View, Text, Pressable, Image, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { LostFoundItem, LostFoundStatus } from '../../types/lostFound';

const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

const STATUS_LABEL: Record<LostFoundStatus, string> = {
  lost: '찾는 중',
  found: '수령 가능',
  claimed: '수령 완료',
};

/** 오늘/어제/n일 전 + HH:MM 형태. iso 가 없으면 "-". */
function formatRelativeDateTime(iso: string | undefined): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const time = `${hh}:${mm}`;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfTarget = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfToday - startOfTarget) / (24 * 60 * 60 * 1000));

  if (dayDiff === 0) return `오늘 ${time}`;
  if (dayDiff === 1) return `어제 ${time}`;
  if (dayDiff > 1) return `${dayDiff}일 전 ${time}`;
  return time;
}

export interface LostFoundCardProps {
  item: LostFoundItem;
  onPress?: () => void;
}

export function LostFoundCard({ item, onPress }: LostFoundCardProps) {
  const statusLabel = STATUS_LABEL[item.status];
  const hasPill = item.status !== 'lost';

  const cardStyle = {
    width: '100%' as const,
    backgroundColor: 'rgba(224,220,255,0.5)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  };

  const Container: any = onPress ? Pressable : View;
  const containerProps = onPress
    ? {
        onPress,
        accessibilityRole: 'button' as const,
        accessibilityLabel: `${item.title} - ${statusLabel}`,
        style: ({ pressed }: { pressed: boolean }) => ({
          ...cardStyle,
          opacity: pressed ? 0.85 : 1,
        }),
      }
    : { style: cardStyle };

  return (
    <Container {...containerProps}>
      {/* 상단: 썸네일 + 제목/위치 */}
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', paddingBottom: 12 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            backgroundColor: '#FAFAFF',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={24} color="#BDBDD4" />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {item.location ?? ''}
          </Text>
        </View>
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 하단 meta row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
        <Ionicons name="time-outline" size={14} color="#3F3F5C" />
        <Text style={[styles.meta, { marginLeft: 4 }]}>{formatRelativeDateTime(item.reportedAt)}</Text>
        <Text style={[styles.meta, { marginLeft: 16 }]}>안내데스크</Text>

        <View style={{ flex: 1 }} />

        {hasPill ? (
          <View
            style={{
              height: 22,
              paddingHorizontal: 12,
              borderRadius: 11,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        ) : (
          <Text style={styles.statusText}>{statusLabel}</Text>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#02015B',
  },
  location: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#3F3F5C',
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D9D9D9',
  },
  meta: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#3F3F5C',
  },
  statusText: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#000000',
  },
});
