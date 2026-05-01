function normalizeApiBaseUrl(): string | null {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '';
  if (raw === '') return null;
  return raw.replace(/\/$/, '');
}

const apiBaseUrl = normalizeApiBaseUrl();

/**
 * 개발자 도구(/map-editor 등) 노출 여부.
 * EXPO_PUBLIC_DEV_TOOLS=1 일 때만 활성화. production 배포에선 미설정 →
 * dev 라우트 가드가 home 으로 리다이렉트.
 *
 * EXPO_PUBLIC_* 는 빌드 타임에 박히므로 토글 시 dev 서버 재시작 필요.
 */
const devToolsEnabled = process.env.EXPO_PUBLIC_DEV_TOOLS === '1';

export const config = {
  apiBaseUrl,
  isApiEnabled: !!apiBaseUrl,
  devToolsEnabled,
} as const;
