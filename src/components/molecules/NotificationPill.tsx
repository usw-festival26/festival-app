/**
 * NotificationPill - 공지 리스트 아이템 (Figma 920:4490)
 *
 * 369×47.758 rounded-[100px] 흰색 pill. 좌측 핀 아이콘(선택), 우측 chevron.
 * 펼친 상태(expanded=true)면 하단에 흰색 본문 카드를 함께 렌더한다.
 */
import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface NotificationPillProps {
  title: string;
  pinned?: boolean;
  expanded?: boolean;
  content?: string;
  onPress?: () => void;
}

export function NotificationPill({
  title,
  pinned = false,
  expanded = false,
  content,
  onPress,
}: NotificationPillProps) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded }}
        style={({ pressed }) => ({
          width: 369,
          height: 47.758,
          borderRadius: 100,
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        {pinned && (
          <View style={{ marginRight: 12 }}>
            <Ionicons name="pin" size={18} color="#FFBEBF" />
          </View>
        )}
        <Text
          style={[
            styles.title,
            { color: pinned ? '#FFBEBF' : '#02015B', flex: 1 },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#02015B"
        />
      </Pressable>

      {expanded && content ? (
        <View
          style={{
            width: 369,
            marginTop: 8,
            backgroundColor: '#FFFFFF',
            borderRadius: 21,
            paddingVertical: 16,
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.content}>{content}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-SemiBold' }),
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18,
  },
  content: {
    fontFamily: Platform.select({ web: 'Pretendard', default: 'Pretendard-Regular' }),
    fontSize: 13,
    lineHeight: 20,
    color: '#02015B',
  },
});
