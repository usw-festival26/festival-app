function normalizeApiBaseUrl(): string | null {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '';
  if (raw === '') return null;
  return raw.replace(/\/$/, '');
}

const apiBaseUrl = normalizeApiBaseUrl();

export const config = {
  apiBaseUrl,
  isApiEnabled: !!apiBaseUrl,
} as const;
