export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? null,
  isApiEnabled: !!process.env.EXPO_PUBLIC_API_BASE_URL,
} as const;
