/**
 * NotificationPill - 공지 리스트 아이템 (Figma 920:4490)
 *
 * - 접힌 상태: 369×47.758 rounded-100 흰색 pill. pinned 시 분홍 pushpin 아이콘 좌측 삽입.
 * - 펼친 상태: rounded-25 흰색 카드. 상단 헤더(shadow로 pill 구분) + 하단 본문 텍스트.
 * 텍스트는 항상 검정. pushpin 아이콘만 분홍(#E8648C).
 */
import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export interface NotificationPillProps {
  title: string;
  pinned?: boolean;
  expanded?: boolean;
  content?: string;
  onPress?: () => void;
}

const WIDTH = 369;
const PILL_HEIGHT = 47.758;
const PIN_COLOR = '#E8648C';

function PushpinIcon({ size = 15 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={7} r={5} fill={PIN_COLOR} />
      <Path
        d="M9.5 11.5 L14.5 11.5 L13.2 18 L12 22 L10.8 18 Z"
        fill={PIN_COLOR}
      />
    </Svg>
  );
}

function Header({
  pinned,
  title,
  expanded,
  onPress,
}: {
  pinned: boolean;
  title: string;
  expanded: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ expanded }}
      style={({ pressed }) => ({
        width: WIDTH,
        height: PILL_HEIGHT,
        borderRadius: 100,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        opacity: pressed ? 0.85 : 1,
        ...(expanded
          ? Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
              },
              android: { elevation: 3 },
              web: { boxShadow: '0px 5px 10px 0px rgba(0,0,0,0.25)' } as any,
            })
          : null),
      })}
    >
      {pinned && (
        <View style={{ marginRight: 12 }}>
          <PushpinIcon size={15} />
        </View>
      )}
      <Text style={[styles.title, { flex: 1 }]} numberOfLines={1}>
        {title}
      </Text>
      <Ionicons
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={16}
        color="#000000"
      />
    </Pressable>
  );
}

export function NotificationPill({
  title,
  pinned = false,
  expanded = false,
  content,
  onPress,
}: NotificationPillProps) {
  if (!expanded) {
    return (
      <View style={{ alignItems: 'center' }}>
        <Header
          pinned={pinned}
          title={title}
          expanded={false}
          onPress={onPress}
        />
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: WIDTH,
          backgroundColor: '#FFFFFF',
          borderRadius: 25,
          overflow: 'visible',
        }}
      >
        <Header pinned={pinned} title={title} expanded onPress={onPress} />
        {content ? (
          <View
            style={{
              paddingHorizontal: 27,
              paddingTop: 16,
              paddingBottom: 18,
            }}
          >
            <Text style={styles.content}>{content}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-SemiBold' }),
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 19,
    color: '#000000',
  },
  content: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-Regular' }),
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
  },
});
