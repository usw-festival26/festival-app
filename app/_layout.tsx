import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';
import { OnboardingProvider, useOnboarding } from '../src/hooks/useOnboarding';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(onboarding)',
};

SplashScreen.preventAutoHideAsync();

function MobileWeb({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <div className="mobile-backdrop">
      <div className="mobile-content">{children}</div>
    </div>
  );
}

function RootNavigator() {
  const { hasOnboarded } = useOnboarding();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (hasOnboarded === null) return;

    const inOnboarding = (segments[0] as string) === '(onboarding)';

    if (hasOnboarded && inOnboarding) {
      router.replace('/(tabs)/home' as any);
    } else if (!hasOnboarded && !inOnboarding) {
      router.replace('/(onboarding)/' as any);
    }
  }, [hasOnboarded, segments]);

  return (
    <Stack>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <OnboardingProvider>
      <MobileWeb>
        <RootNavigator />
      </MobileWeb>
    </OnboardingProvider>
  );
}
