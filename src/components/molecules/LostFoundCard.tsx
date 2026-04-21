/**
 * LostFoundCard - 분실물 카드 (Figma 1228:1018)
 *
 * rgba(224,220,255,0.5) 라벤더 반투명 카드 + 흰 보더 + rounded-[20px]
 * 좌측 #FAFAFF 썸네일 placeholder, 우측 제목/장소/메타 + 상태 뱃지
 */
import React from 'react';
import { View, Text, Pressable, Image, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { LostFoundItem, LostFoundStatus } from '../../types/lostFound';
import { formatDate } from '../../utils/date';
import { LOST_FOUND_STATUS_LABEL, LOST_FOUND_CATEGORY_LABEL } from '../../constants/lostFound';

const STATUS_COLOR: Record<LostFoundStatus, { bg: string; fg: string }> = {
  lost: { bg: '#FFBEBF', fg: '#7A001F' },
  found: { bg: '#C6FFD8', fg: '#006B2B' },
  claimed: { bg: '#E0DCFF', fg: '#02015B' },
};

export interface LostFoundCardProps {
  item: LostFoundItem;
  onPress?: () => void;
}

export function LostFoundCard({ item, onPress }: LostFoundCardProps) {
  const status = STATUS_COLOR[item.status];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} - ${LOST_FOUND_STATUS_LABEL[item.status]} - ${LOST_FOUND_CATEGORY_LABEL[item.category]}`}
      style={({ pressed }) => ({
        width: '100%',
        maxWidth: 352,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(224,220,255,0.5)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        padding: 14,
        flexDirection: 'row',
        gap: 14,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 80,
          height: 80,
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
          <Ionicons name="image-outline" size={28} color="#BDBDD4" />
        )}
      </View>

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.time}>{formatDate(item.reportedAt)}</Text>
          <View
            style={{
              backgroundColor: status.bg,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 12,
            }}
          >
            <Text style={[styles.statusText, { color: status.fg }]}>
              {LOST_FOUND_STATUS_LABEL[item.status]}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-SemiBold' }),
    fontWeight: '600',
    fontSize: 15,
    color: '#02015B',
  },
  location: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-Regular' }),
    fontSize: 12,
    color: '#3F3F5C',
    marginTop: 4,
  },
  time: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-Regular' }),
    fontSize: 11,
    color: '#7C7C97',
  },
  statusText: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-SemiBold' }),
    fontWeight: '600',
    fontSize: 11,
  },
});
