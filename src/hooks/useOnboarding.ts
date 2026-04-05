/**
 * 온보딩 상태 관리 훅 (Context 기반)
 *
 * AsyncStorage로 첫 방문 여부를 관리하며,
 * Context를 통해 앱 전체에서 동일한 상태를 공유합니다.
 */
import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'hasOnboarded';

interface OnboardingContextValue {
  hasOnboarded: boolean | null;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  hasOnboarded: null,
  completeOnboarding: async () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setHasOnboarded(value === 'true');
    });
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setHasOnboarded(true);
  }, []);

  return React.createElement(OnboardingContext.Provider, {
    value: { hasOnboarded, completeOnboarding },
    children,
  });
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
