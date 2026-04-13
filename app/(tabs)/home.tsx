/**
 * 홈 화면 - Figma 74:28
 *
 * 햄버거+LOGO 헤더 → 메인 포스터 → Events → About Us → Information → Footer
 */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { AppText } from '../../src/components/atoms/AppText';
import { ScrollScreenTemplate } from '../../src/components/templates/ScrollScreenTemplate';
import { HeroSection } from '../../src/components/organisms/HeroSection';
import { EventsSection } from '../../src/components/organisms/EventsSection';
import { AboutSection } from '../../src/components/organisms/AboutSection';
import { Footer } from '../../src/components/molecules/Footer';

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <ScrollScreenTemplate showHeader={false}>
      {/* 헤더: 햄버거 메뉴 + LOGO */}
      <View className="flex-row items-center px-4 h-[50px] bg-festival-primary">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className="w-[30px] h-[30px] items-center justify-center active:opacity-70"
        >
          <Ionicons name="menu" size={28} color="#000" />
        </Pressable>
        <View className="flex-1 items-center justify-center">
          <AppText className="text-[20px] font-black text-black">LOGO</AppText>
        </View>
        <View className="w-[30px]" />
      </View>

      {/* 메인 포스터 */}
      <HeroSection />

      {/* Events 섹션 */}
      <View className="bg-white pt-2">
        <EventsSection />
      </View>

      {/* About Us 섹션 */}
      <View className="bg-white">
        <AboutSection />
      </View>

      {/* Information 버튼 */}
      <View className="bg-white px-4 pb-4">
        <Pressable
          onPress={() => router.push('/(tabs)/information' as any)}
          className="h-[35px] bg-festival-primary rounded-full items-center justify-center active:opacity-70"
        >
          <AppText className="text-[15px] font-semibold text-black">
            Information
          </AppText>
        </Pressable>
      </View>

      {/* 푸터 */}
      <Footer />
    </ScrollScreenTemplate>
  );
}
