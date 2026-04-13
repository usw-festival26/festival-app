/**
 * 드로어 네비게이션 레이아웃
 *
 * 햄버거 메뉴를 통한 사이드 드로어 내비게이션
 */
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContent } from '../../src/components/organisms/DrawerContent';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 250,
          borderTopRightRadius: 100,
          overflow: 'hidden',
        },
      }}
    >
      <Drawer.Screen name="home" options={{ drawerLabel: '홈' }} />
      <Drawer.Screen name="booth" options={{ drawerLabel: '지도' }} />
      <Drawer.Screen name="menu" options={{ drawerLabel: '메뉴' }} />
      <Drawer.Screen name="timetable" options={{ drawerLabel: '타임테이블' }} />
      <Drawer.Screen name="announcements" options={{ drawerLabel: '공지' }} />
      <Drawer.Screen name="lost-found" options={{ drawerLabel: '분실물' }} />
      <Drawer.Screen name="information" options={{ drawerLabel: '추가정보' }} />
    </Drawer>
  );
}
