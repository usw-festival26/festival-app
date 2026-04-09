import { config } from '@config/env';
import { ApiError } from './errors';

const DEFAULT_TIMEOUT_MS = 10_000;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!config.apiBaseUrl) {
    throw new ApiError(0, 'API base URL이 설정되지 않았습니다.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  if (options?.signal) {
    options.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const url = `${config.apiBaseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
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
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new ApiError(0, 'API 요청 시간 초과', null);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
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
