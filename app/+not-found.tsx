/**
 * 404 페이지 - Figma 382:850
 */
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { NotFoundContent } from '../src/components/organisms/NotFoundContent';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NotFoundContent onGoHome={() => router.replace('/(tabs)/home' as any)} />
    </>
  );
}
