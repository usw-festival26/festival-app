/**
 * 스플래시 화면 - Figma 74:7
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { SplashContent } from '../src/components/organisms/SplashContent';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <SplashContent onPress={() => router.replace('/(tabs)/home' as any)} />
  );
}
