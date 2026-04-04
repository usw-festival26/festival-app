/**
 * 앱 컬러 토큰
 *
 * NativeWind의 tailwind.config.js와 동기화하여 사용합니다.
 * JS에서 직접 색상값이 필요한 경우 이 상수를 참조하세요.
 */
export const Colors = {
  festival: {
    primary: '#D9D9D9',
    secondary: '#7D7D7D',
    accent: '#000000',
    bg: '#D9D9D9',
    card: '#FFFFFF',
    text: '#000000',
    muted: '#7D7D7D',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
} as const;
