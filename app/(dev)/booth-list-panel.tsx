/**
 * 부스 목록 패널 (dev only) — 핀 에디터 보조 도구.
 *
 * 운영자 워크플로우 가정:
 *  - 데스크톱 웹: 핀 에디터에서 "별도 창" 버튼 → window.open 으로 이 라우트 노출
 *    → 별도 창으로 띄워두고 ID 빠르게 복붙. 메인 에디터 폭은 영향받지 않음.
 *  - 네이티브: 같은 라우트로 router.push, 뒤로 버튼으로 에디터 복귀.
 *
 * 클러스터 상태는 AsyncStorage('dev:mapEditor:v1') 를 source of truth 로 두고
 * 웹은 storage 이벤트로 cross-window 동기화한다 (BoothListPanel 내부 처리).
 */
import React from 'react';
import { Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BoothListPanel } from '../../src/components/dev/BoothListPanel';

export default function BoothListPanelScreen() {
  const router = useRouter();
  // 웹 popup 으로 열린 창은 부모로 돌아갈 router stack 이 없으므로 X 가 자기 창을 닫는다.
  // 그 외(라우터로 push 된 경우) 는 router.back 으로 에디터로 복귀.
  const isPopup =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    !!window.opener &&
    window.opener !== window;

  const handleClose = () => {
    if (isPopup && typeof window !== 'undefined') {
      window.close();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <BoothListPanel onClose={handleClose} closeMode={isPopup ? 'close' : 'back'} />
    </View>
  );
}
