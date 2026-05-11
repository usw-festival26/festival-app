/**
 * GuestbookForm - 추가정보 화면 하단의 "한마디" 입력 카드.
 *
 * 백엔드 미정 상태 — 현재는 로컬 state + onSubmit 콜백만. 부모가 콜백을
 * 미연결하면 제출 시 console.log + 입력 초기화. 추후 API endpoint 가 정해지면
 * 부모에서 useMutation 등으로 연결만 하면 됨.
 *
 * 디자인은 About 카드(흰 배경 + asymmetric radius) 의 mini 버전.
 */
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

const PRETENDARD_BLACK = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Black' });
const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });

const MAX_LENGTH = 200;

export interface GuestbookFormProps {
  /**
   * 제출 핸들러. 미전달 시 console.log + 입력 초기화 로 동작 (백엔드 연결 전 placeholder).
   * Promise 반환 가능 — 처리 중엔 버튼 disabled.
   */
  onSubmit?: (message: string) => void | Promise<void>;
  /** 카드 너비. 기본 368 (Figma About 카드와 동일). */
  width?: number;
  placeholder?: string;
}

export function GuestbookForm({
  onSubmit,
  width = 368,
  placeholder = '대동제에 한마디 남겨주세요',
}: GuestbookFormProps) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = message.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const value = message.trim();
    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(value);
      } else {
        // 백엔드 미정 — placeholder 동작
        // eslint-disable-next-line no-console
        console.log('[GuestbookForm] 한마디 제출 (백엔드 미연결):', value);
      }
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={{
        width,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 71.5,
        borderTopRightRadius: 71.5,
        borderBottomRightRadius: 71.5,
        borderBottomLeftRadius: 10,
        alignSelf: 'center',
        paddingTop: 36,
        paddingHorizontal: 28,
        paddingBottom: 28,
        marginTop: 8,
      }}
    >
      <Text
        style={{
          fontFamily: PRETENDARD_BLACK,
          fontWeight: '900',
          fontSize: 22,
          lineHeight: 26,
          color: '#0068FF',
          textAlign: 'center',
          letterSpacing: -0.5,
        }}
      >
        한마디
      </Text>
      <Text
        style={{
          fontFamily: PRETENDARD_REGULAR,
          fontSize: 12,
          lineHeight: 18,
          color: '#001E56',
          textAlign: 'center',
          marginTop: 8,
          letterSpacing: -0.3,
        }}
      >
        대동제를 즐기며 떠오른 생각을 남겨보세요.
      </Text>

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        maxLength={MAX_LENGTH}
        editable={!submitting}
        style={{
          marginTop: 20,
          minHeight: 96,
          borderWidth: 1,
          borderColor: '#C3EDFF',
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          fontFamily: PRETENDARD_REGULAR,
          fontSize: 14,
          lineHeight: 20,
          color: '#001E56',
          textAlignVertical: 'top',
          ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null),
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontFamily: PRETENDARD_REGULAR,
            fontSize: 11,
            color: '#7D7D7D',
          }}
        >
          {message.length} / {MAX_LENGTH}
        </Text>

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityLabel="한마디 제출"
          accessibilityState={{ disabled: !canSubmit }}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 22,
            borderRadius: 999,
            backgroundColor: canSubmit ? '#0068FF' : '#C3EDFF',
          }}
        >
          <Text
            style={{
              fontFamily: PRETENDARD_SEMIBOLD,
              fontWeight: '600',
              fontSize: 14,
              color: canSubmit ? '#FFFFFF' : '#001E56',
              letterSpacing: -0.3,
            }}
          >
            {submitting ? '전송 중…' : '남기기'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
