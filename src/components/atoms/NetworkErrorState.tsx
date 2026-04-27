/**
 * NetworkErrorState - 네트워크 실패 시 표시 (Figma 1777:725)
 *
 * 빨간 ⚠️ + "네트워크 연결이 지연되고 있어요!" + "다시 시도하기" 버튼.
 * 리스트/스크린의 error 분기에 사용한다. 빈 상태(데이터 0건)는 EmptyState 사용.
 */
import React from 'react';
import { View, Pressable, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@constants/colors';

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
      <Ionicons name="warning" size={100} color={Colors.festival.errorRed} />

      <Text
        className="mt-6 text-[15px] font-semibold text-center text-festival-text"
        style={{ fontFamily: PRETENDARD_SEMIBOLD }}
      >
        {message}
      </Text>

      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          className="mt-5 w-[135px] h-10 rounded-[20px] border border-festival-text items-center justify-center"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text
            className="text-[15px] font-semibold text-festival-text"
            style={{ fontFamily: PRETENDARD_SEMIBOLD }}
          >
            {retryLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
