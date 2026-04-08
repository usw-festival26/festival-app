import { config } from '@config/env';
import { ApiError } from './errors';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!config.apiBaseUrl) {
    throw new ApiError(0, 'API base URL이 설정되지 않았습니다.');
  }

  const url = `${config.apiBaseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, `API 요청 실패: ${res.status}`, body);
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path);
  },
  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
