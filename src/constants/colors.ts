/**
 * 앱 컬러 토큰
 *
 * NativeWind의 tailwind.config.js와 동기화하여 사용합니다.
 * JS에서 직접 색상값이 필요한 경우 이 상수를 참조하세요.
 *
 * 새 브랜드 팔레트:
 *  - primary (#0068FF) — saturated 브랜드 블루 (= secondaryTo, CTA 끝)
 *  - primaryLight (#C3EDFF) — pale 브랜드 톤 (배경/hover/카드 강조 등)
 *  - secondaryFrom (#A5FFF3) → secondaryTo (#0068FF) — CTA·강조 그라디언트
 *  - primaryDark (#010070) — MIDNIGHT 네이비 (헤더/대시 영역, 기존 유지)
 *
 * 기존 lavender/pink 는 legacy 호환용으로 남겨둠 — 점진적 마이그레이션.
 */
export const Colors = {
  festival: {
    primaryDark: '#010070',
    primary: '#0068FF',
    primaryLight: '#C3EDFF',
    secondaryFrom: '#A5FFF3',
    secondaryTo: '#0068FF',
    nav: '#70D4FF',
    lavender: '#E0DCFF',
    pink: '#FFBEBF',
    bright: '#FEF2FF',
    surface: '#D9D9D9',
    card: '#FFFFFF',
    text: '#000000',
    muted: '#7D7D7D',
    mutedDark: '#515151',
    errorRed: '#FF3B30',
    logoPurple: '#9B5A9A',
    pinCluster: '#0068FF',
    pinFood: '#FF7A00',
    pinFacility: '#22C55E',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
} as const;
