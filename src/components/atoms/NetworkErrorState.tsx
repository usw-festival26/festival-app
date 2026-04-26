/**
 * NetworkErrorState - 네트워크 실패 시 표시 (Figma 1777:725)
 *
 * 빨간 ⚠️ + "네트워크 연결이 지연되고 있어요!" + "다시 시도하기" 버튼.
 * 리스트/스크린의 error 분기에 사용한다. 빈 상태(데이터 0건)는 EmptyState 사용.
 */
import React from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface NetworkErrorStateProps {
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

const PRETENDARD_SEMIBOLD = Platform.select({
  web: 'Pretendard Variable',
  default: 'Pretendard-SemiBold',
});

export function NetworkErrorState({
  message = '네트워크 연결이 지연되고 있어요!',
  retryLabel = '다시 시도하기',
  onRetry,
  className = '',
}: NetworkErrorStateProps) {
  return (
    <View className={`items-center justify-center py-16 ${className}`}>
      <Ionicons name="warning" size={100} color="#FF3B30" />

      <Text
        style={{
          marginTop: 24,
          fontFamily: PRETENDARD_SEMIBOLD,
          fontWeight: '600',
          fontSize: 15,
          color: '#000000',
          textAlign: 'center',
        }}
      >
        {message}
      </Text>

      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          style={({ pressed }) => ({
            marginTop: 20,
            width: 135,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: PRETENDARD_SEMIBOLD,
              fontWeight: '600',
              fontSize: 15,
              color: '#000000',
            }}
          >
            {retryLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
