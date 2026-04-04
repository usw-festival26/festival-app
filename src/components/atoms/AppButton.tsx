/**
 * AppButton - 테마가 적용된 버튼 컴포넌트
 *
 * @example
 * <AppButton onPress={handlePress}>확인</AppButton>
 * <AppButton variant="secondary" size="sm" onPress={handlePress}>취소</AppButton>
 */
import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends Omit<PressableProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-festival-accent active:opacity-80',
  secondary: 'bg-festival-primary active:opacity-80',
  outline: 'border border-festival-accent bg-transparent active:opacity-80',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 rounded-md',
  md: 'px-5 py-2.5 rounded-lg',
  lg: 'px-7 py-3.5 rounded-xl',
};

const TEXT_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-festival-text',
  outline: 'text-festival-text',
};

const TEXT_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function AppButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: AppButtonProps) {
  return (
    <Pressable
      className={`items-center justify-center ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      <AppText
        className={`font-semibold ${TEXT_VARIANT_CLASSES[variant]} ${TEXT_SIZE_CLASSES[size]}`}
      >
        {children}
      </AppText>
    </Pressable>
  );
}
