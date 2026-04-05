/**
 * 스플래시 화면 - Figma 74:2 & 74:7
 *
 * 흰 배경 → 회색 배경 → 온보딩으로 전환
 */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../src/components/atoms/AppText';

export default function SplashScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<'white' | 'gray'>('white');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('gray'), 1500);
    const timer2 = setTimeout(() => {
      router.replace('/onboarding' as any);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <View className={`flex-1 items-center justify-center ${phase === 'white' ? 'bg-white' : 'bg-festival-primary'}`}>
      <AppText className="text-[48px] font-black text-black text-center leading-[45px]">
        MAIN{'\n'}LOGO
      </AppText>
    </View>
  );
}
