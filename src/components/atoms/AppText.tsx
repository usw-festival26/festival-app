/**
 * AppText - 테마가 적용된 텍스트 컴포넌트
 *
 * @example
 * <AppText variant="h1">제목</AppText>
 * <AppText variant="body">본문 텍스트</AppText>
 * <AppText variant="caption" className="text-red-500">빨간 캡션</AppText>
 */
import React from 'react';
import { Text, type TextProps } from 'react-native';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<TextVariant, string> = {
  h1: 'text-3xl font-bold text-festival-text',
  h2: 'text-2xl font-semibold text-festival-text',
  h3: 'text-xl font-semibold text-festival-text',
  body: 'text-base text-festival-text',
  caption: 'text-sm text-festival-muted',
  label: 'text-xs font-medium uppercase tracking-wide text-festival-muted',
};

export function AppText({ variant = 'body', className = '', children, ...rest }: AppTextProps) {
  return (
    <Text className={`${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </Text>
  );
}
