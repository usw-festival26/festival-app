/**
 * 개발자 도구 라우트 가드.
 *
 * EXPO_PUBLIC_DEV_TOOLS=1 일 때만 (dev) 그룹의 라우트가 활성화된다.
 * 환경변수 미설정 시 home 으로 즉시 리다이렉트 — production 빌드에선
 * 번들에 코드는 포함되지만 접근이 차단됨.
 */
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { config } from '../../src/config/env';

export default function DevLayout() {
  if (!config.devToolsEnabled) {
    return <Redirect href="/(tabs)/home" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
